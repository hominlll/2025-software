// backend/server.js
import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

const app = express();
const SECRET_KEY = "your_secret_key";

app.use(cors());
app.use(bodyParser.json());

/* -------------------- 이미지 업로드 설정 (multer) -------------------- */
import multer from "multer";
import path from "path";

// uploads 폴더 없으면 생성
import fs from "fs";
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// 저장 방식 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 정적 이미지 제공
app.use("/uploads", express.static("uploads"));

/* -------------------- 파일 업로드 API 추가 -------------------- */
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.json({ success: false, message: "이미지 업로드 실패" });
  }

  const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  res.json({
    success: true,
    url: fileUrl,
  });
});

/* -------------------- DB 연결 -------------------- */

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test1234",
  database: "login_db",
});

db.connect((err) => {
  if (err) console.error("❌ login_db 연결 실패:", err);
  else console.log("✅ login_db 연결 성공");
});

const mentoringDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "test1234",
  database: "mentoring",
});

mentoringDB.connect((err) => {
  if (err) console.error("❌ mentoring DB 연결 실패:", err);
  else console.log("✅ mentoring DB 연결 성공");
});

const studyDB = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "test1234",
  database: "study_db",
  port: 3306,
});

studyDB.connect((err) => {
  if (err) console.error("❌ study DB 연결 실패:", err.code, "-", err.message);
  else console.log("✅ study_db 연결 성공");
});

/* -------------------- 회원 / 인증 API -------------------- */

app.post("/api/signup", async (req, res) => {
  const { userId, password, email, name, nickname } = req.body;
  try {
    if (!userId || !password || !email || !name || !nickname)
      return res.json({ success: false, message: "모든 필드를 입력해주세요." });

    const [exist] = await db.promise().query("SELECT * FROM users WHERE userId = ?", [userId]);
    if (exist.length)
      return res.json({ success: false, message: "이미 존재하는 아이디입니다." });

    const [emailExist] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (emailExist.length)
      return res.json({ success: false, message: "이미 가입된 이메일입니다." });

    const hashed = await bcrypt.hash(password, 10);
    await db
      .promise()
      .query(
        "INSERT INTO users (userId, password, email, name, nickname) VALUES (?, ?, ?, ?, ?)",
        [userId, hashed, email, name, nickname]
      );

    res.json({ success: true, message: "회원가입 완료!" });
  } catch (err) {
    console.error("❌ 회원가입 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

app.post("/api/login", async (req, res) => {
  const { userId, password } = req.body;
  try {
    const [rows] = await db.promise().query("SELECT * FROM users WHERE userId = ?", [userId]);
    if (!rows.length)
      return res.json({ success: false, message: "존재하지 않는 아이디입니다." });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.json({ success: false, message: "비밀번호가 일치하지 않습니다." });

    const token = jwt.sign({ id: user.id, userId: user.userId }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ success: true, user, token });
  } catch (err) {
    console.error("❌ 로그인 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

app.post("/api/find-id", async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await db.promise().query("SELECT userId FROM users WHERE email = ?", [email]);
    if (!rows.length)
      return res.json({ success: false, message: "해당 이메일로 가입된 계정이 없습니다." });
    res.json({ success: true, userId: rows[0].userId });
  } catch (err) {
    console.error("❌ 아이디 찾기 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

app.post("/api/find-password", async (req, res) => {
  const { userId, email } = req.body;
  try {
    const [rows] = await db
      .promise()
      .query("SELECT password FROM users WHERE userId = ? AND email = ?", [userId, email]);

    if (!rows.length)
      return res.json({ success: false, message: "정보가 일치하지 않습니다." });

    res.json({ success: true, password: "비밀번호는 보안상 표시되지 않습니다." });
  } catch (err) {
    console.error("❌ 비밀번호 찾기 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

app.post("/api/user-info", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    const [rows] = await db
      .promise()
      .query(
        "SELECT userId, email, name, nickname, join_date FROM users WHERE userId = ?",
        [userId]
      );

    if (!rows.length)
      return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error("❌ 유저 정보 조회 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// 회원 정보 수정
app.put("/api/update-user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId, name, nickname, email } = req.body;

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // 현재 닉네임 조회
    const [current] = await db.promise().query(
      "SELECT nickname FROM users WHERE userId = ?",
      [userId]
    );
    if (current.length === 0)
      return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });

    const oldNickname = current[0].nickname;

    // users 테이블 업데이트
    await db
      .promise()
      .query(
        "UPDATE users SET name = ?, nickname = ?, email = ? WHERE userId = ?",
        [name, nickname, email, userId]
      );

    // nickname 변경 시 studies 테이블 writer도 함께 업데이트
    if (oldNickname !== nickname) {
      await studyDB
        .promise()
        .query(
          "UPDATE studies SET writer = ? WHERE writer = ?",
          [nickname, oldNickname]
        );
    }

    res.json({ success: true, message: "회원 정보가 수정되었습니다." });
  } catch (err) {
    console.error("❌ 회원정보 수정 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// 비밀번호 변경
app.put("/api/change-password", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId, oldPassword, newPassword } = req.body;

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const [rows] = await db
      .promise()
      .query("SELECT password FROM users WHERE userId = ?", [userId]);
    if (rows.length === 0)
      return res.json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });

    const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
    if (!isMatch)
      return res.json({
        success: false,
        message: "현재 비밀번호가 일치하지 않습니다.",
      });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .promise()
      .query("UPDATE users SET password = ? WHERE userId = ?", [
        hashedPassword,
        userId,
      ]);

    res.json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    });
  } catch (err) {
    console.error("❌ 비밀번호 변경 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// 회원 탈퇴
app.delete("/api/delete-user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { userId } = req.body;

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    await db
      .promise()
      .query("DELETE FROM users WHERE userId = ?", [userId]);

    res.json({ success: true, message: "회원 탈퇴가 완료되었습니다." });
  } catch (err) {
    console.error("❌ 회원 탈퇴 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

/* -------------------- 멘토 API -------------------- */

/* 멘토 목록 (경로 통일: /api/mentors) */
app.get("/api/mentors", (req, res) => {
  mentoringDB.query("SELECT * FROM mentors", (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

/* 멘토 상세 조회 */
app.get("/api/mentor/:id", (req, res) => {
  const mentorId = req.params.id;

  mentoringDB.query(
    "SELECT * FROM mentors WHERE id = ?",
    [mentorId],
    (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).send(err);
      }
      if (results.length === 0) {
        return res.json({
          success: false,
          message: "멘토를 찾을 수 없습니다.",
        });
      }
      res.json({ success: true, mentor: results[0] });
    }
  );
});

/* 멘토 등록 */
app.post("/api/mentor", (req, res) => {
  let {
    name,
    position,
    experience,
    company,
    price,
    category,
    tags,
    image,
    description,
    rating,
    reviews,
  } = req.body;

  // 기본값 처리
  rating = rating ?? 0;
  reviews = reviews ?? 0;

  tags = tags ?? "";
  image = image ?? "";
  description = description ?? "";

  const sql = `
    INSERT INTO mentors 
    (name, position, experience, company, rating, reviews, price, category, tags, image, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name,
    position,
    experience,
    company,
    rating,
    reviews,
    price,
    category,
    tags,
    image,
    description,
  ];

  mentoringDB.query(sql, values, (err, result) => {
    if (err) {
      console.error("멘토 등록 오류:", err);
      return res.json({ success: false, message: "DB 오류" });
    }
    res.json({
      success: true,
      message: "멘토 등록 완료!",
      id: result.insertId,
    });
  });
});


/* -------------------- 스터디 API -------------------- */

// 스터디 전체 조회
app.get("/api/studies", async (req, res) => {
  try {
    const [rows] = await studyDB
      .promise()
      .query(
        `SELECT 
            s.*,
            (
              SELECT COUNT(*) 
              FROM study_participants sp 
              WHERE sp.studyId = s.id
            ) AS participantCount
         FROM studies s
         ORDER BY s.createdAt DESC`
      );

    res.json(rows);
  } catch (err) {
    console.error("❌ study 조회 오류:", err);
    res.status(500).send(err);
  }
});

// 스터디 등록
app.post("/api/studies", (req, res) => {
  const {
    studyName,
    writer,
    category,
    deadline,
    method,
    duration,
    maxPeople,
    description,
    contactLink
  } = req.body;

  const sql =
    "INSERT INTO studies (studyName, writer, category, deadline, method, duration, maxPeople, description, contactLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  studyDB.query(
    sql,
    [
      studyName,
      writer,
      category,
      deadline,
      method,
      duration,
      maxPeople,
      description,
      contactLink
    ],
    (err, result) => {
      if (err) {
        console.error("❌ 스터디 저장 오류:", err);
        return res.status(500).send(err);
      }
      res.json({ success: true, id: result.insertId });
    }
  );
});

// 스터디 상세 조회
app.get("/api/studies/:id", (req, res) => {
  const { id } = req.params;

  studyDB.query("SELECT * FROM studies WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("❌ 스터디 상세 조회 오류:", err);
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "스터디를 찾을 수 없습니다." });
    }

    res.json(results[0]);
  });
});

// 스터디 삭제
app.delete("/api/studies/:id", (req, res) => {
  const { id } = req.params;

  studyDB.query(
    "DELETE FROM studies WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("❌ 스터디 삭제 오류:", err);
        return res.status(500).send(err);
      }
      res.json({ success: true, message: "삭제 완료되었습니다." });
    }
  );
});

/* -------------------- 스터디 참여자 API -------------------- */

// 참여자 수 조회
app.get("/api/study/:id/participants-count", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await studyDB
      .promise()
      .query("SELECT COUNT(*) AS count FROM study_participants WHERE studyId = ?", [id]);

    res.json({ success: true, count: rows[0].count });
  } catch (err) {
    console.error("❌ 참여자 수 조회 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// 참여자 목록 조회
app.get("/api/study/:id/participants", async (req, res) => {
  const { id } = req.params;

  try {
    // studyDB에서 study_participants 테이블, login_db에서 users 테이블 조인
    const [rows] = await studyDB
      .promise()
      .query(
        `SELECT sp.userId, u.nickname, sp.joinedAt
         FROM study_participants sp
         LEFT JOIN login_db.users u ON sp.userId = u.userId
         WHERE sp.studyId = ?
         ORDER BY sp.joinedAt ASC`,
        [id]
      );

    res.json({ success: true, participants: rows });
  } catch (err) {
    console.error("❌ 참여자 목록 조회 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

/* -------------------- 스터디 참여자 강제퇴장 API -------------------- */
app.delete("/api/study/:studyId/participant/:userId", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { studyId, userId } = req.params;

  if (!token) return res.status(401).json({ success: false, message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const currentUserId = decoded.userId;

    // 현재 유저가 스터디 작성자인지 확인
    const [studyRows] = await studyDB
      .promise()
      .query("SELECT writer FROM studies WHERE id = ?", [studyId]);

    if (studyRows.length === 0) return res.status(404).json({ success: false, message: "스터디를 찾을 수 없습니다." });

    const writerNickname = studyRows[0].writer;

    // 작성자 닉네임 가져오기
    const [userRows] = await db.promise().query("SELECT nickname FROM users WHERE userId = ?", [currentUserId]);
    const currentUserNickname = userRows.length > 0 ? userRows[0].nickname : null;

    if (currentUserNickname !== writerNickname) {
      return res.status(403).json({ success: false, message: "작성자만 참여자를 강제퇴장시킬 수 있습니다." });
    }

    // 자기 자신은 강제퇴장 불가
    if (userId === currentUserId) {
      return res.status(400).json({ success: false, message: "자기 자신은 강제퇴장할 수 없습니다." });
    }

    // 참여자 삭제
    await studyDB
      .promise()
      .query("DELETE FROM study_participants WHERE studyId = ? AND userId = ?", [studyId, userId]);

    res.json({ success: true, message: "참여자가 강제퇴장 되었습니다." });
  } catch (err) {
    console.error("참여자 강제퇴장 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});
/*-----------------------------------------------------------*/

// 스터디 참여
app.post("/api/study/join", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { studyId } = req.body;

  if (!token) return res.status(401).json({ success: false, message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    // 이미 참여했는지 확인
    const [exist] = await studyDB
      .promise()
      .query("SELECT * FROM study_participants WHERE studyId = ? AND userId = ?", [studyId, userId]);
    if (exist.length > 0) return res.json({ success: false, message: "이미 참여한 스터디입니다." });

    // 모집인원 확인
    const [studyRows] = await studyDB
      .promise()
      .query("SELECT maxPeople FROM studies WHERE id = ?", [studyId]);
    if (studyRows.length === 0) return res.json({ success: false, message: "스터디를 찾을 수 없습니다." });

    const maxPeople = studyRows[0].maxPeople;
    const [countRows] = await studyDB
      .promise()
      .query("SELECT COUNT(*) AS count FROM study_participants WHERE studyId = ?", [studyId]);
    if (countRows[0].count >= maxPeople) return res.json({ success: false, message: "모집인원이 다 찼습니다." });

    // 참여 추가
    await studyDB
      .promise()
      .query("INSERT INTO study_participants (studyId, userId) VALUES (?, ?)", [studyId, userId]);

    res.json({ success: true, message: "스터디 참여 완료!" });
  } catch (err) {
    console.error("❌ 스터디 참여 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// 스터디 참여 취소
app.post("/api/study/cancel", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { studyId } = req.body;

  if (!token) return res.status(401).json({ success: false, message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    await studyDB
      .promise()
      .query("DELETE FROM study_participants WHERE studyId = ? AND userId = ?", [studyId, userId]);

    res.json({ success: true, message: "스터디 참여 취소 완료!" });
  } catch (err) {
    console.error("❌ 스터디 참여 취소 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// 스터디 조회수 증가
app.post("/api/studies/:id/views", async (req, res) => {
  const { id } = req.params;
  try {
    await studyDB
      .promise()
      .query("UPDATE studies SET views = views + 1 WHERE id = ?", [id]);

    const [rows] = await studyDB
      .promise()
      .query("SELECT views FROM studies WHERE id = ?", [id]);

    res.json({ success: true, views: rows[0].views });
  } catch (err) {
    console.error("❌ 조회수 증가 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

/* -------------------- 커뮤니티 게시글 / 댓글 API -------------------- */

// 게시글 목록 가져오기
app.get("/api/community/posts", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM community_info ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ 커뮤니티 글 목록 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// 게시글 작성
app.post("/api/community/posts", async (req, res) => {
  const { userId, title, category, content } = req.body;

  if (!userId || !title || !category || !content) {
    return res
      .status(400)
      .json({ success: false, message: "필수 값이 누락되었습니다." });
  }

  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO community_info (userId, title, category, content) VALUES (?, ?, ?, ?)",
        [userId, title, category, content]
      );

    const post = {
      id: result.insertId,
      userId,
      title,
      category,
      content,
      created_at: new Date(),
    };

    res.status(201).json({ success: true, post });
  } catch (err) {
    console.error("❌ 커뮤니티 글 작성 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// 내 스터디 + 참여중인 스터디 조회
app.get("/api/user-studies", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.userId;

    // users 테이블에서 닉네임 가져오기
    const [userRows] = await db.promise().query("SELECT nickname FROM users WHERE userId = ?", [userId]);
    if (userRows.length === 0) return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });
    const nickname = userRows[0].nickname;

    // 내가 만든 스터디 조회 (writer가 닉네임인 경우)
    const [myStudies] = await studyDB.promise().query(
      `SELECT s.*, 
        (SELECT COUNT(*) FROM study_participants sp WHERE sp.studyId = s.id) AS participantCount
       FROM studies s
       WHERE s.writer = ?
       ORDER BY s.createdAt DESC`,
      [nickname]
    );

    // 내가 참여한 스터디 조회
    const [joinedStudies] = await studyDB.promise().query(
      `SELECT s.*, 
        (SELECT COUNT(*) FROM study_participants sp WHERE sp.studyId = s.id) AS participantCount
       FROM study_participants sp
       JOIN studies s ON sp.studyId = s.id
       WHERE sp.userId = ?
       ORDER BY s.createdAt DESC`,
      [userId]
    );

    res.json({ success: true, myStudies, joinedStudies });
  } catch (err) {
    console.error("❌ 내 스터디 조회 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// ------------------- ✅ 커뮤니티 댓글 API -------------------

// 댓글 목록 가져오기
app.get("/api/community/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;

  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, post_id, userId, content, created_at FROM community_comments WHERE post_id = ? ORDER BY created_at ASC",
        [postId]
      );

    res.json(rows); // 그대로 배열 보내기
  } catch (err) {
    console.error("❌ 댓글 목록 조회 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

// 댓글 작성
app.post("/api/community/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { userId, content } = req.body;

  if (!content) {
    return res
      .status(400)
      .json({ success: false, message: "댓글 내용을 입력해주세요." });
  }

  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO community_comments (post_id, userId, content) VALUES (?, ?, ?)",
        [postId, userId || null, content]
      );

    // 방금 저장된 댓글 정보 돌려주기
    res.status(201).json({
      id: result.insertId,
      post_id: Number(postId),
      userId: userId || null,
      content,
      created_at: new Date(),
    });
  } catch (err) {
    console.error("❌ 댓글 작성 오류:", err);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});


/* -------------------- 서버 실행 -------------------- */

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
