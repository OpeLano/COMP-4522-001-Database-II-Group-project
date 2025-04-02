import React, { useState, useEffect } from 'react';

function PractitionersTab() {
  const [practitioners, setPractitioners] = useState([]);
  const [formData, setFormData] = useState({
    practitioner_id: '',
    staff_id: '',
    first_name: '',
    last_name: '',
    specialization: '',
    phone_num: '',
    email: ''
  });
  const [editing, setEditing] = useState(false);

  const baseUrl = 'http://localhost:3000/api/practitioners';

  useEffect(() => {
    fetchPractitioners();
  }, []);

  const fetchPractitioners = () => {
    fetch(baseUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching practitioners: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => setPractitioners(data))
      .catch(error => console.error(error));
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      // Update practitioner
      fetch(`${baseUrl}/${formData.practitioner_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staff_id: formData.staff_id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_num: formData.phone_num,
          email: formData.email,
          specialization: formData.specialization
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error updating practitioner: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Practitioner updated:', data);
          setEditing(false);
          resetForm();
          fetchPractitioners();
        })
        .catch(error => console.error(error));
    } else {
      // Create new practitioner
      fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_num: formData.phone_num,
          email: formData.email,
          specialization: formData.specialization
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error creating practitioner: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Practitioner created:', data);
          resetForm();
          fetchPractitioners();
        })
        .catch(error => console.error(error));
    }
  };

  const resetForm = () => {
    setFormData({
      practitioner_id: '',
      staff_id: '',
      first_name: '',
      last_name: '',
      specialization: '',
      phone_num: '',
      email: ''
    });
  };

  const handleEdit = (practitioner) => {
    setEditing(true);
    setFormData({
      practitioner_id: practitioner.practitioner_id,
      staff_id: practitioner.staff_id,
      first_name: practitioner.first_name,
      last_name: practitioner.last_name,
      specialization: practitioner.specialization,
      phone_num: practitioner.phone_num,
      email: practitioner.email
    });
  };

  const handleDelete = (practitionerId) => {
    if (!window.confirm('Are you sure you want to delete this practitioner?')) return;
    fetch(`${baseUrl}/${practitionerId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error deleting practitioner: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Practitioner deleted:', data);
        fetchPractitioners();
      })
      .catch(error => console.error(error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Wellness Clinic - Practitioners</h1>
      <h2>All Practitioners</h2>
      {practitioners.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Staff ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Specialization</th>
              <th>Phone</th>
              <th>Email</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {practitioners.map((p) => (
              <tr key={p.practitioner_id}>
                <td>{p.practitioner_id}</td>
                <td>{p.staff_id}</td>
                <td>{p.first_name}</td>
                <td>{p.last_name}</td>
                <td>{p.specialization}</td>
                <td>{p.phone_num}</td>
                <td>{p.email}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(p.practitioner_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No practitioners found.</p>
      )}

      <hr />

      <h2>{editing ? 'Edit Practitioner' : 'Add New Practitioner'}</h2>
      <form onSubmit={handleSubmit}>
        {editing && (
          <div>
            <label>Practitioner ID:</label>
            <input
              type="text"
              name="practitioner_id"
              value={formData.practitioner_id}
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
          <label>Specialization:</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            placeholder="e.g., Cardiologist, Dermatologist"
            required
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

export default PractitionersTab;
