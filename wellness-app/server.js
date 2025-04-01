// server.js
const express = require('express');
const mysql = require('mysql2'); // or mysql2
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',          // your DB password
  database: 'wellness_clinic'
});

db.connect(err => {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// ====== CRUD ROUTES FOR "PATIENTS" ======

// 1) READ all patients
app.get('/api/patients', (req, res) => {
  const sql = 'SELECT * FROM Patients';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
});

// 2) CREATE a new patient
app.post('/api/patients', (req, res) => {
  const { first_name, last_name, date_of_birth, phone_num, email } = req.body;
  const sql = `
    INSERT INTO Patients (first_name, last_name, date_of_birth, phone_num, email)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [first_name, last_name, date_of_birth, phone_num, email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: 'Patient added', insertedId: result.insertId });
  });
});

// 3) UPDATE an existing patient
app.put('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, date_of_birth, phone_num, email } = req.body;
  const sql = `
    UPDATE Patients
    SET first_name = ?, last_name = ?, date_of_birth = ?, phone_num = ?, email = ?
    WHERE patient_id = ?
  `;
  db.query(sql, [first_name, last_name, date_of_birth, phone_num, email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    return res.json({ message: 'Patient updated' });
  });
});

// 4) DELETE a patient
app.delete('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Patients WHERE patient_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    return res.json({ message: 'Patient deleted' });
  });
});

// ====== CRUD ROUTES FOR "PRACTITIONERS" ======

// 1) READ all practitioners (join practitioners and staff tables)
app.get('/api/practitioners', (req, res) => {
  const sql = `
    SELECT p.practitioner_id, p.staff_id, s.first_name, s.last_name, s.role, p.specialization, s.phone_num, s.email
    FROM practitioners p
    JOIN staff s ON p.staff_id = s.staff_id;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
});

// 2) CREATE a new practitioner (insert into staff then practitioners)
app.post('/api/practitioners', (req, res) => {
  const { first_name, last_name, role, phone_num, email, specialization } = req.body;
  const staffSql = `
    INSERT INTO staff (first_name, last_name, role, phone_num, email)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(staffSql, [first_name, last_name, role, phone_num, email], (err, staffResult) => {
    if (err) return res.status(500).json({ error: err.message });
    const staff_id = staffResult.insertId;
    const practSql = `
      INSERT INTO practitioners (staff_id, specialization)
      VALUES (?, ?)
    `;
    db.query(practSql, [staff_id, specialization], (err, practResult) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ 
        message: 'Practitioner added', 
        practitioner_id: practResult.insertId, 
        staff_id, 
        first_name, 
        last_name, 
        role, 
        phone_num, 
        email, 
        specialization 
      });
    });
  });
});

// 3) UPDATE an existing practitioner (update both staff and practitioners)
app.put('/api/practitioners/:id', (req, res) => {
  const { id } = req.params;
  const { staff_id, first_name, last_name, role, phone_num, email, specialization } = req.body;
  const staffSql = `
    UPDATE staff
    SET first_name = ?, last_name = ?, role = ?, phone_num = ?, email = ?
    WHERE staff_id = ?
  `;
  db.query(staffSql, [first_name, last_name, role, phone_num, email, staff_id], (err, staffResult) => {
    if (err) return res.status(500).json({ error: err.message });
    const practSql = `
      UPDATE practitioners
      SET specialization = ?
      WHERE practitioner_id = ?
    `;
    db.query(practSql, [specialization, id], (err, practResult) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ message: 'Practitioner updated' });
    });
  });
});

// 4) DELETE a practitioner (delete from practitioners then from staff)
app.delete('/api/practitioners/:id', (req, res) => {
  const { id } = req.params;
  // First, retrieve the staff_id for the given practitioner
  const findSql = `SELECT staff_id FROM practitioners WHERE practitioner_id = ?`;
  db.query(findSql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Practitioner not found' });
    const staff_id = results[0].staff_id;
    // Delete the practitioner record
    const deletePractSql = `DELETE FROM practitioners WHERE practitioner_id = ?`;
    db.query(deletePractSql, [id], (err, deleteResult) => {
      if (err) return res.status(500).json({ error: err.message });
      // Optionally, delete the associated staff record
      const deleteStaffSql = `DELETE FROM staff WHERE staff_id = ?`;
      db.query(deleteStaffSql, [staff_id], (err, staffDeleteResult) => {
        if (err) console.error('Error deleting from staff table:', err);
        return res.json({ message: 'Practitioner deleted successfully' });
      });
    });
  });
});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
