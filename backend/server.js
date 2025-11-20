import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

const app = express();
const SECRET_KEY = "your_secret_key"; // JWT 비밀키

app.use(cors());
app.use(bodyParser.json());

// ✅ MySQL 연결
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test1234", // 🔹 실제 MySQL 비밀번호 확인 필요
  database: "login_db",
});

// ✅ DB 연결 확인
db.connect((err) => {
  if (err) {
    console.error("❌ MySQL 연결 실패:", err);
  } else {
    console.log("✅ MySQL 연결 성공");
  }
});

// ✅ 회원가입
app.post("/api/signup", async (req, res) => {
  const { userId, password, email, name, nickname } = req.body;

  try {
    if (!userId || !password || !email || !name || !nickname) {
      return res.json({ success: false, message: "모든 필드를 입력해주세요." });
    }

    // 아이디 중복 확인
    const [exist] = await db.promise().query("SELECT * FROM users WHERE userId = ?", [userId]);
    if (exist.length > 0) {
      return res.json({ success: false, message: "이미 존재하는 아이디입니다." });
    }

    // 이메일 중복 확인
    const [emailExist] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (emailExist.length > 0) {
      return res.json({ success: false, message: "이미 가입된 이메일입니다." });
    }

    // 비밀번호 해싱 후 저장
    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .promise()
      .query(
        "INSERT INTO users (userId, password, email, name, nickname) VALUES (?, ?, ?, ?, ?)",
        [userId, hashedPassword, email, name, nickname]
      );

    res.json({ success: true, message: "회원가입 완료!" });
  } catch (err) {
    console.error("❌ 회원가입 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// ✅ 로그인
app.post("/api/login", async (req, res) => {
  const { userId, password } = req.body;

  try {
    const [rows] = await db.promise().query("SELECT * FROM users WHERE userId = ?", [userId]);
    if (rows.length === 0) {
      return res.json({ success: false, message: "존재하지 않는 아이디입니다." });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "비밀번호가 일치하지 않습니다." });
    }

    const token = jwt.sign({ id: user.id, userId: user.userId }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ success: true, user, token });
  } catch (err) {
    console.error("❌ 로그인 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// ✅ 아이디 찾기
app.post("/api/find-id", async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await db.promise().query("SELECT userId FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.json({ success: false, message: "해당 이메일로 가입된 계정이 없습니다." });
    }

    res.json({ success: true, userId: rows[0].userId });
  } catch (err) {
    console.error("❌ 아이디 찾기 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// ✅ 비밀번호 찾기
app.post("/api/find-password", async (req, res) => {
  const { userId, email } = req.body;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT password FROM users WHERE userId = ? AND email = ?", [userId, email]);

    if (rows.length === 0) {
      return res.json({ success: false, message: "정보가 일치하지 않습니다." });
    }

    res.json({
      success: true,
      password: "비밀번호는 보안상 표시되지 않습니다. 관리자에게 문의하세요.",
    });
  } catch (err) {
    console.error("❌ 비밀번호 찾기 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// ✅ 사용자 정보 불러오기 (수정 완료)
app.post("/api/user-info", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const { userId } = req.body;

    const [rows] = await db
      .promise()
      .query("SELECT userId, email, name, nickname, join_date FROM users WHERE userId = ?", [userId]);

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });

    res.json(rows[0]); // ✅ 프론트에서 userInfo로 바로 받기 위해
  } catch (err) {
    console.error("❌ 유저 정보 조회 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// ✅ 회원정보 수정
app.put("/api/update-user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId, name, nickname, email } = req.body;

  if (!token) return res.status(401).json({ success: false, message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    await db
      .promise()
      .query(
        "UPDATE users SET name = ?, nickname = ?, email = ? WHERE userId = ?",
        [name, nickname, email, userId]
      );

    res.json({ success: true, message: "회원 정보가 수정되었습니다." });
  } catch (err) {
    console.error("❌ 회원정보 수정 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// ✅ 비밀번호 변경
app.put("/api/change-password", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId, oldPassword, newPassword } = req.body;

  if (!token) return res.status(401).json({ success: false, message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // 기존 비밀번호 확인
    const [rows] = await db.promise().query("SELECT password FROM users WHERE userId = ?", [userId]);
    if (rows.length === 0) return res.json({ success: false, message: "사용자를 찾을 수 없습니다." });

    const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
    if (!isMatch) return res.json({ success: false, message: "현재 비밀번호가 일치하지 않습니다." });

    // 새 비밀번호 저장
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.promise().query("UPDATE users SET password = ? WHERE userId = ?", [hashedPassword, userId]);

    res.json({ success: true, message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (err) {
    console.error("❌ 비밀번호 변경 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// ✅ 회원 탈퇴
app.delete("/api/delete-user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId } = req.body;

  if (!token) return res.status(401).json({ success: false, message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    await db.promise().query("DELETE FROM users WHERE userId = ?", [userId]);

    res.json({ success: true, message: "회원 탈퇴가 완료되었습니다." });
  } catch (err) {
    console.error("❌ 회원 탈퇴 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});


// ✅ 서버 실행
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
