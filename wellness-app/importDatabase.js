// importDatabase.js
require('dotenv').config(); // Optional: if you're using environment variables
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

// Setup connection—adjust credentials as needed, or use environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'wellness_clinic',
  multipleStatements: true // Allow multiple SQL statements in one query
});

// Path to your SQL file
const sqlFilePath = path.join(__dirname, 'Wellness Clinic Database.sql');

// Read the file contents
fs.readFile(sqlFilePath, 'utf8', (err, sqlScript) => {
  if (err) {
    return console.error('Error reading SQL file:', err);
  }

  // Execute the SQL script
  connection.query(sqlScript, (err, results) => {
    if (err) {
      console.error('Error executing SQL script:', err);
    } else {
      console.log('Database successfully created/populated!');
    }
    // Always close the connection when done
    connection.end();
  });
});
