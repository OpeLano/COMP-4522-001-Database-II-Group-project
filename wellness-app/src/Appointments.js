// Appointments.js
import React, { useState, useEffect } from 'react';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    appointment_id: '',
    patient_first_name: '',
    patient_last_name: '',
    practitioner_first_name: '',
    practitioner_last_name: '',
    appointment_date: '',
    appointment_type: '',
    status: ''
  });
  const [editing, setEditing] = useState(false);
  const baseUrl = 'http://localhost:3000/api/appointments';

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    fetch(baseUrl)
      .then(response => response.json())
      .then(data => setAppointments(data))
      .catch(error => console.error('Error fetching appointments:', error));
  };

  // Update form state on input change
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle form submission for create/update using names
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      // Update appointment: send names along with other fields
      fetch(`${baseUrl}/${formData.appointment_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_first_name: formData.patient_first_name,
          patient_last_name: formData.patient_last_name,
          practitioner_first_name: formData.practitioner_first_name,
          practitioner_last_name: formData.practitioner_last_name,
          appointment_date: formData.appointment_date,
          appointment_type: formData.appointment_type,
          status: formData.status
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log('Appointment updated:', data);
          setEditing(false);
          resetForm();
          fetchAppointments();
        })
        .catch(error => console.error('Error updating appointment:', error));
    } else {
      // Create a new appointment using names
      fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_first_name: formData.patient_first_name,
          patient_last_name: formData.patient_last_name,
          practitioner_first_name: formData.practitioner_first_name,
          practitioner_last_name: formData.practitioner_last_name,
          appointment_date: formData.appointment_date,
          appointment_type: formData.appointment_type,
          status: formData.status
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log('Appointment created:', data);
          resetForm();
          fetchAppointments();
        })
        .catch(error => console.error('Error creating appointment:', error));
    }
  };

  const resetForm = () => {
    setFormData({
      appointment_id: '',
      patient_first_name: '',
      patient_last_name: '',
      practitioner_first_name: '',
      practitioner_last_name: '',
      appointment_date: '',
      appointment_type: '',
      status: ''
    });
  };

  // Populate the form for editing an appointment
  // (Assumes GET endpoint returns patient_name and practitioner_name as "First Last")
  const handleEdit = (appointment) => {
    setEditing(true);
    const [pFirst, pLast] = appointment.patient_name.split(' ');
    const [prFirst, prLast] = appointment.practitioner_name ? appointment.practitioner_name.split(' ') : ['', ''];
    setFormData({
      appointment_id: appointment.appointment_id,
      patient_first_name: pFirst,
      patient_last_name: pLast,
      practitioner_first_name: prFirst,
      practitioner_last_name: prLast,
      appointment_date: appointment.appointment_date ? appointment.appointment_date.substring(0, 10) : '',
      appointment_type: appointment.appointment_type,
      status: appointment.status
    });
  };

  // Delete an appointment
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    fetch(`${baseUrl}/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Appointment deleted:', data);
        fetchAppointments();
      })
      .catch(error => console.error('Error deleting appointment:', error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Appointments</h1>
      
      {/* Appointment Listing */}
      <h2>All Appointments</h2>
      {appointments.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Practitioner Name</th>
              <th>Appointment Date</th>
              <th>Type</th>
              <th>Status</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.appointment_id}>
                <td>{a.appointment_id}</td>
                <td>{a.patient_name}</td>
                <td>{a.practitioner_name}</td>
                <td>{a.appointment_date ? a.appointment_date.substring(0, 10) : ''}</td>
                <td>{a.appointment_type}</td>
                <td>{a.status}</td>
                <td>
                  <button onClick={() => handleEdit(a)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(a.appointment_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No appointments found.</p>
      )}
      
      <hr />
      
      {/* Appointment Form */}
      <h2>{editing ? 'Edit Appointment' : 'Add New Appointment'}</h2>
      <form onSubmit={handleSubmit}>
        {editing && (
          <div>
            <label>Appointment ID:</label>
            <input
              type="text"
              name="appointment_id"
              value={formData.appointment_id}
              disabled
            />
          </div>
        )}
        <div>
          <label>Patient First Name:</label>
          <input
            type="text"
            name="patient_first_name"
            value={formData.patient_first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Patient Last Name:</label>
          <input
            type="text"
            name="patient_last_name"
            value={formData.patient_last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Practitioner First Name:</label>
          <input
            type="text"
            name="practitioner_first_name"
            value={formData.practitioner_first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Practitioner Last Name:</label>
          <input
            type="text"
            name="practitioner_last_name"
            value={formData.practitioner_last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Appointment Date:</label>
          <input
            type="date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Appointment Type:</label>
          <input
            type="text"
            name="appointment_type"
            value={formData.appointment_type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <button type="submit">{editing ? 'Update' : 'Add'}</button>
          {editing && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setEditing(false);
                resetForm();
              }}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Appointments;
