// DailyLabLog.js
import React, { useEffect, useState } from 'react';

function DailyLabLog() {
  const [logDate, setLogDate] = useState('');
  const [labLogs, setLabLogs] = useState([]);

  const fetchLabLogs = (date) => {
    let url = 'http://localhost:3000/api/reports/daily-lab-log';
    if (date) {
      url += `?date=${date}`;
    }
    fetch(url)
      .then(response => response.json())
      .then(data => setLabLogs(data))
      .catch(error => console.error('Error fetching lab logs:', error));
  };

  useEffect(() => {
    fetchLabLogs('');
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Daily Laboratory Log</h1>
      <div>
        <label>Select Date: </label>
        <input 
          type="date" 
          value={logDate} 
          onChange={e => setLogDate(e.target.value)} 
        />
        <button onClick={() => fetchLabLogs(logDate)}>Fetch Logs</button>
      </div>
      {labLogs.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Test ID</th>
              <th>Patient ID</th>
              <th>Test Type</th>
              <th>Details</th>
              <th>Test Date</th>
            </tr>
          </thead>
          <tbody>
            {labLogs.map(log => (
              <tr key={log.test_id}>
                <td>{log.test_id}</td>
                <td>{log.patient_id}</td>
                <td>{log.test_type}</td>
                <td>{log.details}</td>
                <td>{log.test_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No lab logs available.</p>
      )}
    </div>
  );
}

export default DailyLabLog;
