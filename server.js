const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MySQL database
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
  } else {
    console.log('Connected to database.');
  }
});

// API endpoint to start the timer
app.post('/startTimer', (req, res) => {
  const startTime = Date.now();
  db.query('INSERT INTO timer (start_time) VALUES (?)', [startTime], (err) => {
    if (err) {
      res.status(500).send('Error starting the timer.');
    } else {
      res.status(200).send('Timer started successfully.');
    }
  });
});

// API endpoint to get the start time
app.get('/getStartTime', (req, res) => {
  db.query('SELECT start_time FROM timer ORDER BY id DESC LIMIT 1', (err, results) => {
    if (err || results.length === 0) {
      res.status(500).send('No timer found.');
    } else {
      res.status(200).json({ startTime: results[0].start_time });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
