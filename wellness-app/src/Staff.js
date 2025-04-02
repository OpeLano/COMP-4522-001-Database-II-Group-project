// Staff.js
import React, { useState, useEffect } from 'react';

function Staff() {
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    staff_id: '',
    first_name: '',
    last_name: '',
    role: '',
    phone_num: '',
    email: ''
  });
  const [editing, setEditing] = useState(false);
  const baseUrl = 'http://localhost:3000/api/staff';

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = () => {
    fetch(baseUrl)
      .then(response => response.json())
      .then(data => setStaff(data))
      .catch(error => console.error('Error fetching staff:', error));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      fetch(`${baseUrl}/${formData.staff_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => {
          console.log('Staff updated:', data);
          setEditing(false);
          resetForm();
          fetchStaff();
        })
        .catch(error => console.error('Error updating staff:', error));
    } else {
      fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => {
          console.log('Staff created:', data);
          resetForm();
          fetchStaff();
        })
        .catch(error => console.error('Error creating staff:', error));
    }
  };

  const resetForm = () => {
    setFormData({
      staff_id: '',
      first_name: '',
      last_name: '',
      role: '',
      phone_num: '',
      email: ''
    });
  };

  const handleEdit = (member) => {
    setEditing(true);
    setFormData(member);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    fetch(`${baseUrl}/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Staff deleted:', data);
        fetchStaff();
      })
      .catch(error => console.error('Error deleting staff:', error));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Staff</h1>
      <h2>All Staff Members</h2>
      {staff.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Email</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(member => (
              <tr key={member.staff_id}>
                <td>{member.staff_id}</td>
                <td>{member.first_name}</td>
                <td>{member.last_name}</td>
                <td>{member.role}</td>
                <td>{member.phone_num}</td>
                <td>{member.email}</td>
                <td>
                  <button onClick={() => handleEdit(member)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(member.staff_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No staff found.</p>
      )}
      <hr />
      <h2>{editing ? 'Edit Staff' : 'Add New Staff'}</h2>
      <form onSubmit={handleSubmit}>
        {editing && (
          <div>
            <label>Staff ID:</label>
            <input type="text" name="staff_id" value={formData.staff_id} disabled />
          </div>
        )}
        <div>
          <label>First Name:</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Role:</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} required />
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="text" name="phone_num" value={formData.phone_num} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
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

export default Staff;
