CREATE DATABASE IF NOT EXISTS study_db;
USE study_db;
CREATE TABLE IF NOT EXISTS studies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studyName VARCHAR(255) NOT NULL,
    writer VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    deadline DATE NOT NULL,
    method VARCHAR(20) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    maxPeople INT NOT NULL,
    description TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 조회수 컬럼 추가 (기본값 0)
ALTER TABLE studies
ADD COLUMN views INT NOT NULL DEFAULT 0;

-- 댓글 수 컬럼 추가 (기본값 0)
ALTER TABLE studies
ADD COLUMN comment_count INT NOT NULL DEFAULT 0;
