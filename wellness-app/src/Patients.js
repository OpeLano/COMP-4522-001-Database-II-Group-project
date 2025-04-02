// Patients.js
import React, { useState, useEffect } from 'react';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone_num: '',
    email: ''
  });
  const [editing, setEditing] = useState(false);

  // Fetch all patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    fetch('http://localhost:3000/api/patients')
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.error('Error fetching patients:', error));
  };

  // Handle input changes for the patient form
  const handleChange = (e) => {
    setFormData(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    }));
  };

  // Handle form submission for CREATE/UPDATE operations
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editing) {
      // UPDATE existing patient
      fetch(`http://localhost:3000/api/patients/${formData.patient_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          date_of_birth: formData.date_of_birth,
          phone_num: formData.phone_num,
          email: formData.email
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Update success:', data);
        setEditing(false);
        resetForm();
        fetchPatients();
      })
      .catch(error => console.error('Error updating patient:', error));
    } else {
      // CREATE new patient
      fetch('http://localhost:3000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          date_of_birth: formData.date_of_birth,
          phone_num: formData.phone_num,
          email: formData.email
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Create success:', data);
        resetForm();
        fetchPatients();
      })
      .catch(error => console.error('Error creating patient:', error));
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      first_name: '',
      last_name: '',
      date_of_birth: '',
      phone_num: '',
      email: ''
    });
  };

  // Prepare form for editing by populating fields with existing patient data
  const handleEdit = (patient) => {
    setEditing(true);
    setFormData({
      patient_id: patient.patient_id,
      first_name: patient.first_name,
      last_name: patient.last_name,
      date_of_birth: patient.date_of_birth ? patient.date_of_birth.substring(0,10) : '',
      phone_num: patient.phone_num,
      email: patient.email
    });
  };

  // Delete a patient record
  const handleDelete = (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;

    fetch(`http://localhost:3000/api/patients/${patientId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      console.log('Delete success:', data);
      fetchPatients();
    })
    .catch(error => console.error('Error deleting patient:', error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Wellness Clinic - Patients</h1>
      
      {/* Patient Listing */}
      <h2>All Patients</h2>
      {patients.length > 0 ? (
        <table align="center" border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>DOB</th>
              <th>Phone</th>
              <th>Email</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.patient_id}>
                <td>{p.patient_id}</td>
                <td>{p.first_name}</td>
                <td>{p.last_name}</td>
                <td>{p.date_of_birth ? p.date_of_birth.substring(0,10) : ''}</td>
                <td>{p.phone_num}</td>
                <td>{p.email}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(p.patient_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No patients found.</p>
      )}

      <hr />

      {/* CREATE/UPDATE Form */}
      <h2>{editing ? 'Edit Patient' : 'Add New Patient'}</h2>
      <form onSubmit={handleSubmit}>
        {editing && (
          <div>
            <label>Patient ID:</label>
            <input
              type="text"
              name="patient_id"
              value={formData.patient_id}
              disabled
            />
          </div>
        )}
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone_num"
            value={formData.phone_num}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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

export default Patients;
