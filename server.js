const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: 'sql7.freemysqlhosting.net',
  user: 'sql7757428',
  password: 'ANGIciKEKe',
  database: 'sql7757428',
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/api/start-time', (req, res) => {
  db.query('SELECT startTime FROM timer ORDER BY id DESC LIMIT 1', (err, results) => {
    if (err) {
      console.error('Error fetching start time:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      res.json({ startTime: results[0].startTime });
    } else {
      res.json({ startTime: null });
    }
  });
});

app.post('/api/start-timer', (req, res) => {
  const now = new Date();
  db.query('INSERT INTO timer (startTime) VALUES (?)', [now], (err) => {
    if (err) {
      console.error('Error inserting start time:', err);
      return res.status(500).json({ error: 'Databases error' });
    }
    res.status(200).json({ message: 'Timer started' });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
