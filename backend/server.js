const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

// ✅ CORS 설정 (React 개발 주소 모두 허용)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // React 실행 주소
    credentials: true, // 쿠키, 세션 허용
  })
);

app.use(bodyParser.json());

// ✅ 세션 설정
app.use(
  session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false, // 불필요한 빈 세션 방지
    cookie: {
      httpOnly: true,
      secure: false, // HTTPS가 아니므로 false
      sameSite: "lax", // 크로스도메인에서도 쿠키 유지
      maxAge: 1000 * 60 * 60, // 1시간 유지
    },
  })
);

// ✅ MySQL 연결
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hm09080908",
  database: "login_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB 연결 실패:", err);
  } else {
    console.log("✅ MySQL 연결 성공!");
  }
});

// ✅ 로그인
app.post("/login", (req, res) => {
  const { userId, password } = req.body;
  const sql = "SELECT * FROM users WHERE userId = ? AND password = ?";

  db.query(sql, [userId, password], (err, result) => {
    if (err) {
      console.error("❌ 로그인 오류:", err);
      return res.status(500).json({ success: false, message: "서버 오류 발생" });
    }

    if (result.length > 0) {
      const user = result[0];

      // ✅ 세션 저장
      req.session.user = {
        id: user.id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        nickname: user.nickname,
        join_date: user.join_date,
        isAdmin: user.userId === "admin",
      };

      console.log("✅ 로그인 성공:", req.session.user);
      res.json({ success: true, message: "로그인 성공", user: req.session.user });
    } else {
      res.json({ success: false, message: "아이디 또는 비밀번호가 일치하지 않습니다." });
    }
  });
});

// ✅ 로그아웃
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "로그아웃 성공" });
  });
});

// ✅ 로그인된 사용자 정보 확인
app.get("/api/user/info", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
  }
  res.json({ success: true, user: req.session.user });
});

// ✅ 관리자용 전체 사용자 목록
app.get("/api/admin/users", (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ success: false, message: "관리자만 접근 가능합니다." });
  }

  const sql = "SELECT id, userId, email, name, nickname, join_date FROM users";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ 관리자 사용자 조회 오류:", err);
      return res.status(500).json({ success: false, message: "서버 오류" });
    }
    res.json({ success: true, users: result });
  });
});

// ✅ 회원가입
app.post("/signup", (req, res) => {
  const { userId, password, email } = req.body;

  const checkSql = "SELECT * FROM users WHERE userId = ? OR email = ?";
  db.query(checkSql, [userId, email], (err, result) => {
    if (err) {
      console.error("❌ 중복 검사 오류:", err);
      return res.status(500).json({ success: false, message: "서버 오류 발생" });
    }

    if (result.length > 0) {
      return res.json({ success: false, message: "이미 존재하는 아이디 또는 이메일입니다." });
    }

    const insertSql = "INSERT INTO users (userId, password, email) VALUES (?, ?, ?)";
    db.query(insertSql, [userId, password, email], (err) => {
      if (err) {
        console.error("❌ 회원가입 오류:", err);
        return res.status(500).json({ success: false, message: "회원가입 실패" });
      }
      res.json({ success: true, message: "회원가입 성공" });
    });
  });
});

// ✅ 서버 실행
app.listen(5000, () => {
  console.log("🚀 서버 실행 중: http://localhost:5000");
});
