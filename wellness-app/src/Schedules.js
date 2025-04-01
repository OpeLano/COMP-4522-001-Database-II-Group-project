// Schedules.js
import React, { useState, useEffect } from 'react';

function Schedules() {
  const [activeView, setActiveView] = useState('daily'); // 'daily', 'individual', 'weekly'
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [practitioners, setPractitioners] = useState([]);
  const [selectedPractitioner, setSelectedPractitioner] = useState('');

  useEffect(() => {
    // For the individual schedule view, fetch the list of practitioners
    if (activeView === 'individual') {
      fetch('http://localhost:3000/api/practitioners')
        .then(response => response.json())
        .then(data => setPractitioners(data))
        .catch(error => console.error('Error fetching practitioners:', error));
    }
  }, [activeView]);

  const fetchDailySchedule = () => {
    if (!selectedDate) return;
    fetch(`http://localhost:3000/api/schedules/daily?date=${selectedDate}`)
      .then(response => response.json())
      .then(data => setAppointments(data))
      .catch(error => console.error('Error fetching daily schedule:', error));
  };

  const fetchIndividualSchedule = () => {
    if (!selectedDate || !selectedPractitioner) return;
    fetch(`http://localhost:3000/api/schedules/individual?date=${selectedDate}&practitioner_id=${selectedPractitioner}`)
      .then(response => response.json())
      .then(data => setAppointments(data))
      .catch(error => console.error('Error fetching individual schedule:', error));
  };

  const fetchWeeklySchedule = () => {
    if (!selectedDate) return;
    // Assume selectedDate represents the start of the week (Monday)
    fetch(`http://localhost:3000/api/schedules/weekly?weekStart=${selectedDate}`)
      .then(response => response.json())
      .then(data => setAppointments(data))
      .catch(error => console.error('Error fetching weekly schedule:', error));
  };

  const handleFetch = () => {
    if (activeView === 'daily') {
      fetchDailySchedule();
    } else if (activeView === 'individual') {
      fetchIndividualSchedule();
    } else if (activeView === 'weekly') {
      fetchWeeklySchedule();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Schedules</h1>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => { setActiveView('daily'); setAppointments([]); }}>Daily Master</button>
        <button onClick={() => { setActiveView('individual'); setAppointments([]); }}>Individual Practitioner</button>
        <button onClick={() => { setActiveView('weekly'); setAppointments([]); }}>Weekly Coverage</button>
      </nav>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Select Date: </label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        {activeView === 'individual' && (
          <>
            <label style={{ marginLeft: '10px' }}>Select Practitioner: </label>
            <select value={selectedPractitioner} onChange={(e) => setSelectedPractitioner(e.target.value)}>
              <option value="">--Select--</option>
              {practitioners.map(prac => (
                <option key={prac.practitioner_id} value={prac.practitioner_id}>
                  {prac.first_name} {prac.last_name}
                </option>
              ))}
            </select>
          </>
        )}
        <button onClick={handleFetch} style={{ marginLeft: '10px' }}>Fetch Schedule</button>
      </div>
      
      {appointments.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            {activeView === 'weekly' ? (
              <tr>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Category</th>
                <th>Scheduled Date</th>
              </tr>
            ) : (
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Practitioner</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            )}
          </thead>
          <tbody>
            {appointments.map(item => (
              activeView === 'weekly' ? (
                <tr key={`${item.staff_id}-${item.appointment_date}`}>
                  <td>{item.staff_id}</td>
                  <td>{item.first_name} {item.last_name}</td>
                  <td>{item.role}</td>
                  <td>{item.category}</td>
                  <td>{item.appointment_date ? item.appointment_date.substring(0, 10) : ''}</td>
                </tr>
              ) : (
                <tr key={item.appointment_id}>
                  <td>{item.appointment_id}</td>
                  <td>{item.patient_name}</td>
                  <td>{item.practitioner_name}</td>
                  <td>{item.appointment_date ? item.appointment_date.substring(0, 10) : ''}</td>
                  <td>{item.appointment_type}</td>
                  <td>{item.status}</td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      ) : (
        <p>No schedule data available.</p>
      )}
    </div>
  );
}

export default Schedules;
