// PrescriptionLabelReceipt.js
import React, { useEffect, useState } from 'react';

function PrescriptionLabelReceipt() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/reports/prescriptions')
      .then(response => response.json())
      .then(data => setPrescriptions(data))
      .catch(error => console.error('Error fetching prescriptions:', error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Prescription Labels & Receipts</h1>
      {prescriptions.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Prescription ID</th>
              <th>Patient ID</th>
              <th>Prescription Name</th>
              <th>Instruction</th>
              <th>Usage</th>
              <th>Refill</th>
              <th>Total Amount</th>
              <th>Amount Due</th>
              <th>Balance Due</th>
              <th>Payment Method</th>
              <th>Billing Date</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map(p => (
              <tr key={p.prescriptions_id}>
                <td>{p.prescriptions_id}</td>
                <td>{p.patient_id}</td>
                <td>{p.prescription_name}</td>
                <td>{p.prescription_instruction}</td>
                <td>{p.prescription_usage}</td>
                <td>{p.prescription_refill}</td>
                <td>{p.total_amount}</td>
                <td>{p.amount_due}</td>
                <td>{p.balance_due}</td>
                <td>{p.payment_method}</td>
                <td>{p.billing_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No prescriptions available.</p>
      )}
    </div>
  );
}

export default PrescriptionLabelReceipt;
