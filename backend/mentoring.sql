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
('쿠마쿠마','프론트엔드','시니어(9년 이상)','네카라쿠배',5.0,186,55000,'코딩 테스트,이력서,기술면접,frontend,취업','https://cdn.pixabay.com/photo/2021/08/05/10/34/man-6521725_1280.jpg'),
('G‑Sam','채용담당자','Lead 레벨','멋쟁이사자처럼',5.0,25,9900,'이력서,자기개발,퍼스널 브랜딩,자기소개서,취업','https://cdn.pixabay.com/photo/2016/11/14/03/16/person-1824144_1280.jpg'),
('그릿','백엔드/서버 개발자','주니어(1~3년)','판교 IT 대기업',5.0,44,179900,'Java,Spring,코딩 테스트,이력서,기술면접','https://cdn.pixabay.com/photo/2017/01/12/14/57/woman-1979266_1280.jpg'),
('데브박','풀스택 개발자','중급(4~6년)','스타트업',4.8,60,75000,'JavaScript,Node.js,React,프론트엔드,백엔드','https://cdn.pixabay.com/photo/2017/12/10/14/47/man-3019638_1280.jpg'),
('코드마스터','AI 개발자','시니어(10년 이상)','AI 연구소',5.0,120,120000,'Python,Machine Learning,Deep Learning,AI,취업','https://cdn.pixabay.com/photo/2020/03/14/20/26/artificial-intelligence-4938926_1280.jpg'),
('하이테크','데이터 분석가','중급(4~6년)','빅데이터 회사',4.7,88,65000,'Python,R,SQL,데이터분석,통계','https://cdn.pixabay.com/photo/2018/01/06/10/34/person-3064075_1280.jpg'),
('UX천재','UX/UI 디자이너','시니어(8년 이상)','디자인 에이전시',4.9,45,80000,'UI,UX,프로토타입,Figma,디자인','https://cdn.pixabay.com/photo/2022/03/16/13/34/woman-7072636_1280.jpg'),
('리액트왕','프론트엔드 개발자','주니어(2~3년)','IT 스타트업',4.5,30,55000,'React,JavaScript,프론트엔드,코딩 테스트','https://cdn.pixabay.com/photo/2017/08/06/00/15/blond-2594050_1280.jpg'),
('백엔드신','백엔드 개발자','중급(5년)','대기업 IT부서',4.8,70,90000,'Java,Spring,API,서버,데이터베이스','https://cdn.pixabay.com/photo/2016/03/26/22/13/man-1281679_1280.jpg'),
('AI혁신','AI 엔지니어','시니어(7년 이상)','AI 스타트업',5.0,95,130000,'Python,Deep Learning,TensorFlow,AI,취업','https://cdn.pixabay.com/photo/2015/05/15/14/47/robot-768275_1280.jpg');
