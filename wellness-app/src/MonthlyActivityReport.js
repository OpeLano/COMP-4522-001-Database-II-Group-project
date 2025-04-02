// MonthlyActivityReport.js
import React, { useEffect, useState } from 'react';

function MonthlyActivityReport() {
  const [month, setMonth] = useState('');
  const [report, setReport] = useState(null);

  const fetchReport = (monthValue) => {
    let url = 'http://localhost:3000/api/reports/monthly-activity';
    if (monthValue) {
      url += `?month=${monthValue}`;
    }
    fetch(url)
      .then(response => response.json())
      .then(data => setReport(data))
      .catch(error => console.error('Error fetching monthly report:', error));
  };

  useEffect(() => {
    fetchReport('');
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Monthly Activity Report</h1>
      <div>
        <label>Select Month (YYYY-MM): </label>
        <input 
          type="month" 
          value={month} 
          onChange={e => setMonth(e.target.value)} 
        />
        <button onClick={() => fetchReport(month)}>Generate Report</button>
      </div>
      {report ? (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h2>Activity Summary for {month || 'All Months'}</h2>
          <p><strong>Total Patient Visits:</strong> {report.total_patients_visits}</p>
          <p><strong>Total Surgeries:</strong> {report.total_surgeries}</p>
          <p><strong>Total Deliveries:</strong> {report.total_deliveries}</p>
          <p><strong>Total Lab Tests:</strong> {report.total_lab_tests}</p>
          <p><strong>Total Prescriptions:</strong> {report.total_perscriptions}</p>
          <p><strong>Average Visit Duration:</strong> {report.avg_visit_duration} minutes</p>
        </div>
      ) : (
        <p>No monthly report available.</p>
      )}
    </div>
  );
}

export default MonthlyActivityReport;
