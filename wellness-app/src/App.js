// App.js
import React, { useState } from 'react';
import Patients from './Patients';
import PractitionersTab from './PractitionersTab';
import Appointments from './Appointments';
import Staff from './Staff';
import Schedules from './Schedules';
import Reports from './Reports';

function App() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState('patients');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Wellness Clinic Dashboard</h1>
      
      {/* Navigation */}
      <nav style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('patients')}
          style={{ marginRight: '10px', padding: '10px', backgroundColor: activeTab === 'patients' ? '#ddd' : '#fff' }}
        >
          Patients
        </button>
        <button 
          onClick={() => setActiveTab('practitioners')}
          style={{ marginRight: '10px', padding: '10px', backgroundColor: activeTab === 'practitioners' ? '#ddd' : '#fff' }}
        >
          Practitioners
        </button>
        <button 
          onClick={() => setActiveTab('appointments')}
          style={{ padding: '10px', backgroundColor: activeTab === 'appointments' ? '#ddd' : '#fff' }}
        >
          Appointments
          </button>
        <button 
          onClick={() => setActiveTab('staff')}
          style={{ marginRight: '10px' }}
        >
          Staff
        </button>
        <button onClick={() => setActiveTab('schedules')}>
          Schedules
        </button>
        <button onClick={() => setActiveTab('reports')}>
          Reports
        </button>
      </nav>
      
      {/* Conditional Rendering Based on Active Tab */}
      {activeTab === 'patients' && <Patients />}
      {activeTab === 'practitioners' && <PractitionersTab />}
      {activeTab === 'appointments' && <Appointments />}
      {activeTab === 'staff' && <Staff />}
      {activeTab === 'schedules' && <Schedules />}
      {activeTab === 'reports' && <Reports />}
    </div>
  );
}

export default App;
