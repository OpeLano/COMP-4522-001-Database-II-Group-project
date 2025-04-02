// PhysicianStatement.js
import React, { useEffect, useState } from 'react';

function PhysicianStatement() {
  const [statements, setStatements] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/reports/physician-statements')
      .then(response => response.json())
      .then(data => setStatements(data))
      .catch(error => console.error('Error fetching physician statements:', error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Physician Statements for Insurance Forms</h1>
      {statements.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Statement ID</th>
              <th>Practitioner ID</th>
              <th>Patient ID</th>
              <th>Appointment Type</th>
              <th>Procedures</th>
              <th>Diagnosis</th>
              <th>Billing ID</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {statements.map(s => (
              <tr key={s.statement_id}>
                <td>{s.statement_id}</td>
                <td>{s.practitioners_id}</td>
                <td>{s.patient_id}</td>
                <td>{s.appointment_type}</td>
                <td>{s.procedures}</td>
                <td>{s.diagnosis}</td>
                <td>{s.billing_id}</td>
                <td>{s.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No physician statements available.</p>
      )}
    </div>
  );
}

export default PhysicianStatement;
