// PrescriptionLabelReceipt.js
import React, { useState } from 'react';

function PrescriptionLabelReceipt() {
  const [prescriptionId, setPrescriptionId] = useState('');
  const [prescriptionData, setPrescriptionData] = useState(null);

  const handleFetch = () => {
    fetch(`http://localhost:3000/api/reports/prescription?prescription_id=${prescriptionId}`)
      .then(response => response.json())
      .then(data => setPrescriptionData(data))
      .catch(error => console.error('Error fetching prescription data:', error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Prescription Label & Receipt</h1>
      <div>
        <label>Prescription ID: </label>
        <input 
          type="text" 
          value={prescriptionId} 
          onChange={e => setPrescriptionId(e.target.value)} 
        />
        <button onClick={handleFetch}>Generate Prescription</button>
      </div>
      {prescriptionData && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h2>Prescription Details</h2>
          <div>
            <h3>Label</h3>
            <p><strong>Patient ID:</strong> {prescriptionData.patient_id}</p>
            <p><strong>Prescription Name:</strong> {prescriptionData.prescription_name}</p>
            <p><strong>Instruction:</strong> {prescriptionData.prescription_instruction}</p>
          </div>
          <div style={{ marginTop: '10px' }}>
            <h3>Receipt</h3>
            <p><strong>Usage:</strong> {prescriptionData.prescription_usage}</p>
            <p><strong>Refill:</strong> {prescriptionData.prescription_refill}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrescriptionLabelReceipt;
