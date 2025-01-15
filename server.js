const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
  host: 'sql7.freemysqlhosting.net',
  user: 'sql7757428',
  password: 'ANGIciKEKe',
  database: 'sql7757428',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// API Endpoints
app.post('/startTimer', (req, res) => {
  const startTime = Date.now();

  db.query('SELECT startTime FROM timer ORDER BY id DESC LIMIT 1', (err, result) => {
    if (err) {
      console.error('Error checking start time:', err);
      return res.status(500).send('Database error');
    }

    if (result.length > 0) {
      return res.status(400).send('Timer already started');
    }

    db.query('INSERT INTO timer (startTime) VALUES (?)', [startTime], (err) => {
      if (err) {
        console.error('Error inserting start time:', err);
        return res.status(500).send('Database error');
      }
      res.sendStatus(200);
    });
  });
});

app.get('/getStartTime', (req, res) => {
  db.query('SELECT startTime FROM timer ORDER BY id DESC LIMIT 1', (err, result) => {
    if (err) {
      console.error('Error fetching start time:', err);
      return res.status(500).send('Database error');
    }

    if (result.length === 0) {
      return res.json({ startTime: null });
    }

    res.json({ startTime: parseInt(result[0].startTime, 10) });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
