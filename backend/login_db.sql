-- ⚠️ 기존 DB가 있으면 삭제하고 새로 만드는 경우
DROP DATABASE IF EXISTS login_db;

-- DB 생성 및 사용
CREATE DATABASE login_db;
USE login_db;

-- 로그인(유저) 테이블
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(50),
    nickname VARCHAR(50),
    role ENUM('user','admin') DEFAULT 'user',   -- ★ role 칼럼을 여기 포함
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 멘토 테이블
CREATE TABLE mentor_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    field VARCHAR(100),
    description TEXT,
    FOREIGN KEY (userId) REFERENCES users(userId)
);

-- 스터디 테이블
CREATE TABLE study_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,
    title VARCHAR(100),
    status ENUM('참여 중', '완료') DEFAULT '참여 중',
    FOREIGN KEY (userId) REFERENCES users(userId)
);

-- 커뮤니티 게시글 테이블
CREATE TABLE community_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(50) NOT NULL,          -- 글쓴이 (users.userId)
    title VARCHAR(100) NOT NULL,          -- 제목
    category VARCHAR(50) NOT NULL,        -- 카테고리 (예: '전체', '질문', '자유' 등)
    content TEXT NOT NULL,                -- 내용
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(userId)
);

-- 커뮤니티 댓글 테이블
 CREATE TABLE community_comments (
     id INT AUTO_INCREMENT PRIMARY KEY,
     post_id INT NOT NULL,               -- 어떤 게시글의 댓글인지
     userId VARCHAR(50),                 -- 댓글 작성자 (일단 nullable, 나중에 로그인 붙여도 됨)
     content TEXT NOT NULL,              -- 댓글 내용
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (post_id) REFERENCES community_info(id) ON DELETE CASCADE,
     FOREIGN KEY (userId) REFERENCES users(userId)
);

-- 관리자 계정 하나 추가
INSERT INTO users (userId, password, email, role)
VALUES ('admin', 'admin123', 'admin@example.com', 'admin');
