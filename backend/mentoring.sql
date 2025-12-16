CREATE DATABASE IF NOT EXISTS mentoring;
USE mentoring;
DROP TABLE IF EXISTS mentors;
CREATE TABLE mentors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    position VARCHAR(50) NOT NULL,
    experience ENUM(
        '주니어(1~3년)',
        '미들(3~5년)',
        '시니어(5~8년 이상)'
    ) NOT NULL,
    company VARCHAR(50) NOT NULL,
    rating FLOAT DEFAULT 0,
    reviews INT DEFAULT 0,
    price INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    tags VARCHAR(255),
    image VARCHAR(255) DEFAULT '/img/logo.png',
    description TEXT,
    mentoringMethod TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO mentors (
        title,
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
        mentoringMethod
    )
VALUES (
        '프론트엔드 취업 마스터',
        '쿠마쿠마',
        '프론트엔드',
        '시니어(5~8년 이상)',
        '네카라쿠배',
        4.8,
        39,
        55000,
        '컴퓨터공학',
        '코딩 테스트,이력서,기술면접,frontend,취업',
        'https://cdn.pixabay.com/photo/2021/08/05/10/34/man-6521725_1280.jpg',
        '프론트엔드 취업을 위한 실전 중심 멘토링',
        'Zoom 비대면 / 1:1'
    ),
    (
        'IT 취업 올인원 코칭',
        'G-Sam',
        '채용담당자',
        '미들(3~5년)',
        '멋쟁이사자처럼',
        4.2,
        12,
        9900,
        '컴퓨터공학',
        '이력서,자기개발,퍼스널 브랜딩,자기소개서,취업',
        'https://cdn.pixabay.com/photo/2016/11/14/03/16/person-1824144_1280.jpg',
        '채용 담당자 관점에서 보는 취업 전략',
        '대면 / 비대면 선택'
    ),
    (
        '백엔드 실전 멘토링',
        '그릿',
        '백엔드/서버 개발자',
        '주니어(1~3년)',
        '판교 IT 대기업',
        4.0,
        7,
        15000,
        '컴퓨터공학',
        'Java,Spring,코딩 테스트,이력서,기술면접',
        'https://cdn.pixabay.com/photo/2017/01/12/14/57/woman-1979266_1280.jpg',
        '실무 중심 백엔드 설계 및 코드 리뷰',
        'Zoom 비대면'
    );