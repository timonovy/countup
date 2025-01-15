const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'sql7.freemysqlhosting.net',
    user: 'sql7757428',
    password: 'ANGIciKEKe',
    database: 'sql7757428',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

let startTime = null;

app.post('/startTimer', (req, res) => {
    if (!startTime) {
        startTime = Date.now();
        const sql = `INSERT INTO timer (startTime) VALUES (${startTime})`;
        db.query(sql, err => {
            if (err) {
                console.error('Failed to save start time:', err);
                return res.status(500).send('Database error');
            }
            res.send('Timer started');
        });
    } else {
        res.send('Timer already started');
    }
});

app.get('/getStartTime', (req, res) => {
    const sql = `SELECT startTime FROM timer ORDER BY id DESC LIMIT 1`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Failed to fetch start time:', err);
            return res.status(500).send('Database error');
        }
        res.json({ startTime: results[0]?.startTime || startTime });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
