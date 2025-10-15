const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL 연결
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hm09080908",
  database: "login_demo"
});

db.connect((err) => {
  if (err) {
    console.error("DB 연결 실패:", err);
  } else {
    console.log("DB 연결 성공");
  }
});

// 회원가입
app.post("/api/signup", (req, res) => {
  const { userId, password, email } = req.body;
  db.query(
    "INSERT INTO users (userId, password, email) VALUES (?, ?, ?)",
    [userId, password, email],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.json({ success: false, message: "회원가입 실패" });
      }
      res.json({ success: true });
    }
  );
});

// 로그인
app.post("/api/signup", async (req, res) => {
  const { userId, password, email } = req.body;

  if (!userId || !password || !email) {
    return res.json({ success: false, message: "모든 필드를 입력해주세요." });
  }

  const sql = "INSERT INTO users (userId, password, email) VALUES (?, ?, ?)";
  try {
    await db.query(sql, [userId, password, email]);
    res.json({ success: true, message: "회원가입이 완료되었습니다!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "이미 존재하는 아이디입니다." });
  }
});
// 아이디
app.post("/api/find-id", async (req, res) => {
  const { email } = req.body;
  const [rows] = await db.query("SELECT userId FROM users WHERE email = ?", [email]);
  if (rows.length > 0) {
    res.json({ success: true, message: `당신의 아이디는 ${rows[0].userId} 입니다.` });
  } else {
    res.json({ success: false, message: "해당 이메일로 가입된 계정이 없습니다." });
  }
});
// 비밀번호
app.post("/api/find-password", async (req, res) => {
  const { userId, email } = req.body;
  const [rows] = await db.query("SELECT password FROM users WHERE userId = ? AND email = ?", [userId, email]);
  if (rows.length > 0) {
    res.json({ success: true, message: `비밀번호는 ${rows[0].password} 입니다.` });
  } else {
    res.json({ success: false, message: "일치하는 계정 정보가 없습니다." });
  }
});


app.listen(PORT, () => {
  console.log(`서버 실행: http://localhost:${PORT}`);
});
