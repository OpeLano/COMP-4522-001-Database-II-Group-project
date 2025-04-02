// RecoveryRoomLog.js
import React, { useEffect, useState } from 'react';

function RecoveryRoomLog() {
  const [logDate, setLogDate] = useState('');
  const [recoveryLogs, setRecoveryLogs] = useState([]);

  const fetchRecoveryLogs = (date) => {
    let url = 'http://localhost:3000/api/reports/recovery-room-log';
    if (date) {
      url += `?date=${date}`;
    }
    fetch(url)
      .then(response => response.json())
      .then(data => setRecoveryLogs(data))
      .catch(error => console.error('Error fetching recovery logs:', error));
  };

  useEffect(() => {
    fetchRecoveryLogs('');
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Recovery Room Log</h1>
      <div>
        <label>Select Date: </label>
        <input 
          type="date" 
          value={logDate} 
          onChange={e => setLogDate(e.target.value)} 
        />
        <button onClick={() => fetchRecoveryLogs(logDate)}>Fetch Logs</button>
      </div>
      {recoveryLogs.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Recovery Log ID</th>
              <th>Patient ID</th>
              <th>Admission Time</th>
              <th>Discharge Time</th>
              <th>Practitioner ID</th>
              <th>Observations</th>
            </tr>
          </thead>
          <tbody>
            {recoveryLogs.map(log => (
              <tr key={log.recovery_log_id}>
                <td>{log.recovery_log_id}</td>
                <td>{log.patient_id}</td>
                <td>{log.addmission_time}</td>
                <td>{log.discharge_time}</td>
                <td>{log.practitioner_id}</td>
                <td>{log.observations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No recovery logs available.</p>
      )}
    </div>
  );
}

export default RecoveryRoomLog;
