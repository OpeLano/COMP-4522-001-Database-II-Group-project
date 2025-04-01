// Reports.js
import React, { useState } from 'react';
import PhysicianStatement from './PhysicianStatement';
import PrescriptionLabelReceipt from './PrescriptionLabelReceipt';
import DailyLabLog from './DailyLabLog';
import DailyDeliveryLog from './DailyDeliveryLog';
import RecoveryRoomLog from './RecoveryRoomLog';
import MonthlyActivityReport from './MonthlyActivityReport';

function Reports() {
  const [selectedReport, setSelectedReport] = useState('physician');

  const renderReportComponent = () => {
    switch (selectedReport) {
      case 'physician':
        return <PhysicianStatement />;
      case 'prescription':
        return <PrescriptionLabelReceipt />;
      case 'dailyLab':
        return <DailyLabLog />;
      case 'dailyDelivery':
        return <DailyDeliveryLog />;
      case 'recovery':
        return <RecoveryRoomLog />;
      case 'monthly':
        return <MonthlyActivityReport />;
      default:
        return <div>Please select a report.</div>;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>General Reports</h1>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setSelectedReport('physician')}>Physician Statement</button>
        <button onClick={() => setSelectedReport('prescription')}>Prescription Label & Receipt</button>
        <button onClick={() => setSelectedReport('dailyLab')}>Daily Lab Log</button>
        <button onClick={() => setSelectedReport('dailyDelivery')}>Daily Delivery Log</button>
        <button onClick={() => setSelectedReport('recovery')}>Recovery Room Log</button>
        <button onClick={() => setSelectedReport('monthly')}>Monthly Activity Report</button>
      </nav>
      <div>
        {renderReportComponent()}
      </div>
    </div>
  );
}

export default Reports;
