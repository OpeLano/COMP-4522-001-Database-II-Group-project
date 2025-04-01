// app.js
import React, { useState } from 'react';
import Patients from './Patients';  // Your existing Patients component
import PractitionersTab from './PractitionersTab';  // The new practitioners component

function App() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState('patients');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Wellness Clinic Dashboard</h1>
      
      {/* Navigation buttons */}
      <nav style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('patients')}
          style={{ marginRight: '10px', padding: '10px', backgroundColor: activeTab === 'patients' ? '#ddd' : '#fff' }}
        >
          Patients
        </button>
        <button 
          onClick={() => setActiveTab('practitioners')}
          style={{ padding: '10px', backgroundColor: activeTab === 'practitioners' ? '#ddd' : '#fff' }}
        >
          Practitioners
        </button>
      </nav>
      
      {/* Conditional rendering based on active tab */}
      {activeTab === 'patients' && <Patients />}
      {activeTab === 'practitioners' && <PractitionersTab />}
    </div>
  );
}

export default App;
