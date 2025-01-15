const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const db = mysql.createConnection({
  host: 'sql7.freemysqlhosting.net',
  user: 'sql7757428',
  password: 'ANGIciKEKe',
  database: 'sql7757428',
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  } else {
    console.log('Connected to the MySQL database');
  }
});

// Middleware to parse JSON requests
app.use(express.json());

// Serve the `index.html` file when accessing the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to start the timer
app.post('/startTimer', (req, res) => {
  const startTime = Date.now();

  // Check if the timer has already started
  db.query('SELECT startTime FROM timer ORDER BY id DESC LIMIT 1', (err, result) => {
    if (err) {
      console.error('Error checking start time:', err);
      return res.status(500).send('Database error');
    }

    if (result.length > 0) {
      return res.status(400).send('Timer already started');
    }

    // Insert the start time into the database
    db.query('INSERT INTO timer (startTime) VALUES (?)', [startTime], (err) => {
      if (err) {
        console.error('Error inserting start time:', err);
        return res.status(500).send('Database error');
      }
      res.sendStatus(200);
    });
  });
});

// Endpoint to get the start time
app.get('/getStartTime', (req, res) => {
  db.query('SELECT startTime FROM timer ORDER BY id DESC LIMIT 1', (err, result) => {
    if (err) {
      console.error('Error fetching start time:', err);
      return res.status(500).send('Database error');
    }

    if (result.length === 0) {
      return res.json({ startTime: null });
    }

    res.json({ startTime: parseInt(result[0].startTime) });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
