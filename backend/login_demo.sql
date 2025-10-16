CREATE DATABASE login_db;

USE login_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(50) NOT NULL UNIQUE,   -- 아이디 중복 방지
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE    -- 이메일 중복 방지
);

--DB 삭제명령어
DROP DATABASE IF EXISTS login_demo;
