CREATE DATABASE user_db;

USE user_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  email VARCHAR(100)
);

INSERT INTO users (username, password, name, email)
VALUES
('testuser', '1234', '홍길동', 'hong@test.com'),
('admin', 'admin123', '관리자', 'admin@test.com');
