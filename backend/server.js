const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 멘토 데이터 가져오기
app.get('/mentors', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM mentors');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
