// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// =======================
// PATIENTS ROUTES
// =======================

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
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Patient not found' });
    return res.json({ message: 'Patient updated' });
  });
});

// 4) DELETE a patient
app.delete('/api/patients/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Patients WHERE patient_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Patient not found' });
    return res.json({ message: 'Patient deleted' });
  });
});

// =======================
// PRACTITIONERS ROUTES
// =======================

// CREATE a new practitioner (insert into staff then practitioners)
app.post('/api/practitioners', (req, res) => {
  const { first_name, last_name, phone_num, email, specialization } = req.body;

  // 1) Insert a new Staff record
  //    Assign a default "role" (like "Practitioner" or "Doctor") if not provided.
  const staffSql = `
    INSERT INTO staff (first_name, last_name, role, phone_num, email)
    VALUES (?, ?, 'Practitioner', ?, ?)
  `;
  db.query(staffSql, [first_name, last_name, phone_num, email], (err, staffResult) => {
    if (err) return res.status(500).json({ error: err.message });

    const newStaffId = staffResult.insertId;

    // 2) Insert into the Practitioners table using the newly created staff_id
    const practSql = `
      INSERT INTO practitioners (staff_id, specialization)
      VALUES (?, ?)
    `;
    db.query(practSql, [newStaffId, specialization], (err, practResult) => {
      if (err) return res.status(500).json({ error: err.message });

      return res.json({
        message: 'Practitioner created',
        practitioner_id: practResult.insertId,
        staff_id: newStaffId
      });
    });
  });
});

// READ all practitioners
// Join staff to get first_name, last_name, phone_num, and email
app.get('/api/practitioners', (req, res) => {
  const sql = `
    SELECT
      p.practitioner_id,
      p.staff_id,
      s.first_name,
      s.last_name,
      s.role,
      s.phone_num,
      s.email,
      p.specialization
    FROM practitioners p
    JOIN staff s ON p.staff_id = s.staff_id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
});

// UPDATE an existing practitioner (update both staff and practitioners)
app.put('/api/practitioners/:id', (req, res) => {
  const { id } = req.params; // practitioner_id
  const { staff_id, first_name, last_name, phone_num, email, specialization } = req.body;

  // 1) Update the Staff row
  const staffSql = `
    UPDATE staff
    SET first_name = ?, last_name = ?, phone_num = ?, email = ?
    WHERE staff_id = ?
  `;
  db.query(staffSql, [first_name, last_name, phone_num, email, staff_id], (err, staffResult) => {
    if (err) return res.status(500).json({ error: err.message });

    // 2) Update the Practitioners row
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

// DELETE a practitioner (delete from practitioners then staff)
app.delete('/api/practitioners/:id', (req, res) => {
  const { id } = req.params; // practitioner_id

  // 1) Retrieve the staff_id for the given practitioner
  const findSql = `SELECT staff_id FROM practitioners WHERE practitioner_id = ?`;
  db.query(findSql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Practitioner not found' });

    const staff_id = results[0].staff_id;

    // 2) Delete the practitioner record
    const deletePractSql = `DELETE FROM practitioners WHERE practitioner_id = ?`;
    db.query(deletePractSql, [id], (err, deleteResult) => {
      if (err) return res.status(500).json({ error: err.message });

      // 3) Optionally, delete the associated staff record
      //    If you want to keep staff, remove this step.
      const deleteStaffSql = `DELETE FROM staff WHERE staff_id = ?`;
      db.query(deleteStaffSql, [staff_id], (err, staffDeleteResult) => {
        if (err) console.error('Error deleting from staff table:', err);
        return res.json({ message: 'Practitioner deleted successfully' });
      });
    });
  });
});

// =======================
// APPOINTMENTS ROUTES (Updated)
// =======================

// 1) READ all appointments (with joined names)
app.get('/api/appointments', (req, res) => {
  const sql = `
    SELECT 
      a.appointment_id, 
      CONCAT(pt.first_name, ' ', pt.last_name) AS patient_name,
      CONCAT(st.first_name, ' ', st.last_name) AS practitioner_name,
      a.appointment_date, 
      a.appointment_type, 
      a.status
    FROM appointments a
    JOIN Patients pt ON a.patient_id = pt.patient_id
    LEFT JOIN practitioners pr ON a.practitioner_id = pr.practitioner_id
    LEFT JOIN staff st ON pr.staff_id = st.staff_id;
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
});

// 2) CREATE a new appointment using names
app.post('/api/appointments', (req, res) => {
  const { 
    patient_first_name, 
    patient_last_name, 
    practitioner_first_name, 
    practitioner_last_name, 
    appointment_date, 
    appointment_type, 
    status 
  } = req.body;
  
  // Look up the patient ID by name
  const patientSql = 'SELECT patient_id FROM Patients WHERE first_name = ? AND last_name = ?';
  db.query(patientSql, [patient_first_name, patient_last_name], (err, patientResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (patientResults.length === 0) return res.status(404).json({ error: 'Patient not found' });
    const patient_id = patientResults[0].patient_id;
    
    // Look up the practitioner ID by name (joining practitioners and staff)
    const practSql = `
      SELECT p.practitioner_id 
      FROM practitioners p
      JOIN staff s ON p.staff_id = s.staff_id
      WHERE s.first_name = ? AND s.last_name = ?
    `;
    db.query(practSql, [practitioner_first_name, practitioner_last_name], (err, practResults) => {
      if (err) return res.status(500).json({ error: err.message });
      if (practResults.length === 0) return res.status(404).json({ error: 'Practitioner not found' });
      const practitioner_id = practResults[0].practitioner_id;
      
      // Insert the appointment record using the looked-up IDs
      const sql = `
        INSERT INTO appointments (patient_id, practitioner_id, appointment_date, appointment_type, status)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(sql, [patient_id, practitioner_id, appointment_date, appointment_type, status], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: 'Appointment added', insertedId: result.insertId });
      });
    });
  });
});

// 3) UPDATE an appointment using names
app.put('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { 
    patient_first_name, 
    patient_last_name, 
    practitioner_first_name, 
    practitioner_last_name, 
    appointment_date, 
    appointment_type, 
    status 
  } = req.body;
  
  // Look up the patient ID by name
  const patientSql = 'SELECT patient_id FROM Patients WHERE first_name = ? AND last_name = ?';
  db.query(patientSql, [patient_first_name, patient_last_name], (err, patientResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (patientResults.length === 0) return res.status(404).json({ error: 'Patient not found' });
    const patient_id = patientResults[0].patient_id;
    
    // Look up the practitioner ID by name
    const practSql = `
      SELECT p.practitioner_id 
      FROM practitioners p
      JOIN staff s ON p.staff_id = s.staff_id
      WHERE s.first_name = ? AND s.last_name = ?
    `;
    db.query(practSql, [practitioner_first_name, practitioner_last_name], (err, practResults) => {
      if (err) return res.status(500).json({ error: err.message });
      if (practResults.length === 0) return res.status(404).json({ error: 'Practitioner not found' });
      const practitioner_id = practResults[0].practitioner_id;
      
      // Update the appointment record using the looked-up IDs
      const sql = `
        UPDATE appointments
        SET patient_id = ?, practitioner_id = ?, appointment_date = ?, appointment_type = ?, status = ?
        WHERE appointment_id = ?
      `;
      db.query(sql, [patient_id, practitioner_id, appointment_date, appointment_type, status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Appointment not found' });
        return res.json({ message: 'Appointment updated' });
      });
    });
  });
});

// 4) DELETE an appointment (remains unchanged)
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM appointments WHERE appointment_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Appointment not found' });
    return res.json({ message: 'Appointment deleted' });
  });
});

// =======================
// STAFF ROUTES (updated to include category)
// =======================

// GET all staff members
app.get('/api/staff', (req, res) => {
  const sql = 'SELECT * FROM staff';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
});

// CREATE a new staff member
app.post('/api/staff', (req, res) => {
  const { first_name, last_name, role, phone_num, email } = req.body;
  const sql = `
    INSERT INTO staff (first_name, last_name, role, phone_num, email)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [first_name, last_name, role, phone_num, email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json({ message: 'Staff member added', insertedId: result.insertId });
  });
});

// UPDATE an existing staff member
app.put('/api/staff/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, role, phone_num, email } = req.body;
  const sql = `
    UPDATE staff
    SET first_name = ?, last_name = ?, role = ?, phone_num = ?, email = ?
    WHERE staff_id = ?
  `;
  db.query(sql, [first_name, last_name, role, phone_num, email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Staff member not found' });
    return res.json({ message: 'Staff member updated' });
  });
});

// DELETE a staff member
app.delete('/api/staff/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM staff WHERE staff_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Staff member not found' });
    return res.json({ message: 'Staff member deleted' });
  });
});

// =======================
// SCHEDULES ROUTES
// =======================

// Daily Master Schedule: appointments for a specific day
app.get('/api/schedules/daily', (req, res) => {
  const { date } = req.query;
  const sql = `
    SELECT 
      a.appointment_id, 
      CONCAT(pt.first_name, ' ', pt.last_name) AS patient_name,
      CONCAT(st.first_name, ' ', st.last_name) AS practitioner_name,
      a.appointment_date, 
      a.appointment_type, 
      a.status
    FROM appointments a
    JOIN Patients pt ON a.patient_id = pt.patient_id
    LEFT JOIN practitioners pr ON a.practitioner_id = pr.practitioner_id
    LEFT JOIN staff st ON pr.staff_id = st.staff_id
    WHERE DATE(a.appointment_date) = ?
  `;
  db.query(sql, [date], (err, results) => {
    if(err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
});

// Individual Practitioner Schedule: appointments for a specific practitioner on a specific day
app.get('/api/schedules/individual', (req, res) => {
  const { date, practitioner_id } = req.query;
  const sql = `
    SELECT 
      a.appointment_id, 
      CONCAT(pt.first_name, ' ', pt.last_name) AS patient_name,
      CONCAT(st.first_name, ' ', st.last_name) AS practitioner_name,
      a.appointment_date, 
      a.appointment_type, 
      a.status
    FROM appointments a
    JOIN Patients pt ON a.patient_id = pt.patient_id
    LEFT JOIN practitioners pr ON a.practitioner_id = pr.practitioner_id
    LEFT JOIN staff st ON pr.staff_id = st.staff_id
    WHERE DATE(a.appointment_date) = ? AND pr.practitioner_id = ?
  `;
  db.query(sql, [date, practitioner_id], (err, results) => {
    if(err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
});

// Weekly Coverage Schedule: a placeholder endpoint based on a provided week start date
app.get('/api/schedules/weekly', (req, res) => {
  const { weekStart } = req.query; // weekStart is expected as the Monday of the week
  const sql = `
    SELECT 
      s.staff_id, s.first_name, s.last_name, s.role,
      a.appointment_date
    FROM staff s
    LEFT JOIN appointments a ON s.staff_id = a.practitioner_id
    WHERE WEEK(a.appointment_date, 1) = WEEK(?, 1)
  `;
  db.query(sql, [weekStart], (err, results) => {
    if(err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
});

// 1. Physician Statement for Insurance Forms
app.get('/api/reports/physician-statements', (req, res) => {
  const sql = `
    SELECT
      i.statement_id,
      CONCAT(st.first_name, ' ', st.last_name) AS practitioner_name,
      CONCAT(pt.first_name, ' ', pt.last_name) AS patient_name,
      i.appointment_type,
      i.procedures,
      i.diagnosis,
      i.billing_id,
      i.total_amount
    FROM insurance_statements i
    LEFT JOIN practitioners p ON i.practitioners_id = p.practitioner_id
    LEFT JOIN staff st ON p.staff_id = st.staff_id
    LEFT JOIN patients pt ON i.patient_id = pt.patient_id
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching physician statements:', err);
      return res.status(500).json({ error: err.message });
    }
    return res.json(results);
  });
});



// 2. Prescription Label & Receipt
app.get('/api/reports/prescriptions', (req, res) => {
  const sql = `
    SELECT p.*, b.total_amount, b.amount_due, b.balance_due, b.payment_method, b.billing_date 
    FROM prescriptions p
    LEFT JOIN billing b ON p.prescriptions_id = b.prescription_id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching prescriptions:", err);
      return res.status(500).json({ error: err.message });
    }
    return res.json(results);
  });
});


// 3. Daily Laboratory Log
app.get('/api/reports/daily-lab-log', (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Missing date parameter' });
  }
  const sql = 'SELECT * FROM lab_tests WHERE test_date = ?';
  db.query(sql, [date], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
});

// 4. Daily Delivery Log
app.get('/api/reports/daily-delivery-log', (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Missing date parameter' });
  }
  const sql = 'SELECT * FROM deliveries WHERE delivery_date = ?';
  db.query(sql, [date], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
});

// 5. Recovery Room Log
app.get('/api/reports/recovery-room-log', (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Missing date parameter' });
  }
  // Filtering based on the addmission_time; adjust as needed
  const sql = 'SELECT * FROM recovery_logs WHERE addmission_time = ?';
  db.query(sql, [date], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(results);
  });
});

// 6. Monthly Activity Report
app.get('/api/reports/monthly-activity', (req, res) => {
  const { month } = req.query; // expected format: YYYY-MM
  if (!month) {
    return res.status(400).json({ error: 'Missing month parameter' });
  }
  // Compare the month portion of the stored date with the provided value
  const sql = "SELECT * FROM monthly_reports WHERE DATE_FORMAT(month, '%Y-%m') = ?";
  db.query(sql, [month], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Report not found' });
    return res.json(results[0]);
  });
});

// ------------------------------------------------
// Start the Server
// ------------------------------------------------
const PORT = 3000; // Adjust as needed
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
