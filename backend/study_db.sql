DROP DATABASE IF EXISTS study_db;
CREATE DATABASE IF NOT EXISTS study_db;
USE study_db;
/* 스터디 모집글 정보 테이블 */
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
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INT NOT NULL DEFAULT 0
);
/* 스터디 참여자 저장 테이블 */
CREATE TABLE IF NOT EXISTS study_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studyId INT NOT NULL,
    userId VARCHAR(100) NOT NULL,
    joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studyId) REFERENCES studies(id) ON DELETE CASCADE
);
