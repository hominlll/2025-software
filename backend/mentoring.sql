CREATE DATABASE mentoring;

USE mentoring;

CREATE TABLE mentors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    position VARCHAR(50),
    experience VARCHAR(50),
    company VARCHAR(50),
    rating FLOAT,
    reviews INT,
    price INT,
    tags VARCHAR(255),
    image VARCHAR(255)
);

INSERT INTO mentors (name, position, experience, company, rating, reviews, price, tags, image)
VALUES
('쿠마쿠마','프론트엔드','시니어(9년 이상)','네카라쿠배',5.0,186,55000,'코딩 테스트,이력서,기술면접,frontend,취업','https://via.placeholder.com/150'),
('G-Sam','채용담당자','Lead 레벨','멋쟁이사자처럼',5.0,25,9900,'이력서,자기개발,퍼스널 브랜딩,자기소개서,취업','https://via.placeholder.com/150'),
('그릿','백엔드/서버 개발자','주니어(1~3년)','판교 IT 대기업',5.0,44,179900,'Java,Spring,코딩 테스트,이력서,기술면접','https://via.placeholder.com/150');
