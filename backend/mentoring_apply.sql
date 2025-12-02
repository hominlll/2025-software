USE mentoring;
CREATE TABLE mentor_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    writer VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    career VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);