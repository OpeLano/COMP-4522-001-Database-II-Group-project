// PhysicianStatement.js
import React, { useState } from 'react';

function PhysicianStatement() {
  const [statementId, setStatementId] = useState('');
  const [statement, setStatement] = useState(null);

  const handleFetch = () => {
    fetch(`http://localhost:3000/api/reports/physician-statement?statement_id=${statementId}`)
      .then(response => response.json())
      .then(data => setStatement(data))
      .catch(error => console.error('Error fetching physician statement:', error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Physician Statement for Insurance Forms</h1>
      <div>
        <label>Statement ID: </label>
        <input 
          type="text" 
          value={statementId} 
          onChange={e => setStatementId(e.target.value)} 
        />
        <button onClick={handleFetch}>Generate Statement</button>
      </div>
      {statement && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h2>Statement Details</h2>
          <p><strong>Practitioner ID:</strong> {statement.practitioners_id}</p>
          <p><strong>Patient ID:</strong> {statement.patient_id}</p>
          <p><strong>Appointment Type:</strong> {statement.appointment_type}</p>
          <p><strong>Procedures:</strong> {statement.procedures}</p>
          <p><strong>Diagnosis:</strong> {statement.diagnosis}</p>
          <p><strong>Billing ID:</strong> {statement.billing_id}</p>
          <p><strong>Total Amount:</strong> {statement.total_amount}</p>
        </div>
      )}
    </div>
  );
}

export default PhysicianStatement;
