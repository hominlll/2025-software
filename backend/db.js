const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '09080908', // MySQL 비밀번호
  database: 'mentoring'
});

module.exports = pool.promise();
