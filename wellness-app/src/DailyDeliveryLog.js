// DailyDeliveryLog.js
import React, { useEffect, useState } from 'react';

function DailyDeliveryLog() {
  const [logDate, setLogDate] = useState('');
  const [deliveryLogs, setDeliveryLogs] = useState([]);

  const fetchDeliveryLogs = (date) => {
    let url = 'http://localhost:3000/api/reports/daily-delivery-log';
    if (date) {
      url += `?date=${date}`;
    }
    fetch(url)
      .then(response => response.json())
      .then(data => setDeliveryLogs(data))
      .catch(error => console.error('Error fetching delivery logs:', error));
  };

  useEffect(() => {
    fetchDeliveryLogs('');
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Daily Delivery Log</h1>
      <div>
        <label>Select Date: </label>
        <input 
          type="date" 
          value={logDate} 
          onChange={e => setLogDate(e.target.value)} 
        />
        <button onClick={() => fetchDeliveryLogs(logDate)}>Fetch Logs</button>
      </div>
      {deliveryLogs.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Delivery ID</th>
              <th>Patient ID</th>
              <th>Delivery Date</th>
              <th>Practitioner ID</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {deliveryLogs.map(log => (
              <tr key={log.deliveries_id}>
                <td>{log.deliveries_id}</td>
                <td>{log.patient_id}</td>
                <td>{log.delivery_date}</td>
                <td>{log.practitioner_id}</td>
                <td>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No delivery logs available.</p>
      )}
    </div>
  );
}

export default DailyDeliveryLog;
