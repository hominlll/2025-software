-- DB 생성
CREATE DATABASE login_db;
USE login_db;

-- 로그인 테이블
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(50),
    nickname VARCHAR(50),
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

ALTER TABLE users ADD COLUMN role ENUM('user','admin') DEFAULT 'user';

--DB 삭제명령어
DROP DATABASE IF EXISTS login_db;

INSERT INTO users (userId, password, email, role) VALUES ('admin', 'admin123', 'admin@example.com', 'admin');
