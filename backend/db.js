const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'hm09080908', // MySQL 비밀번호
  database: 'login_db'
});

module.exports = pool.promise();