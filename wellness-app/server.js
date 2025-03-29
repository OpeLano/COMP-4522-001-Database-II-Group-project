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

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
