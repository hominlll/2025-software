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
    views INT NOT NULL DEFAULT 0,
    contactLink VARCHAR(255) NULL
);
INSERT INTO studies (
        studyName,
        writer,
        category,
        deadline,
        method,
        duration,
        maxPeople,
        description,
        views,
        contactLink
    )
VALUES -- 🔵 모집중 (여유 있음)
    (
        '컴퓨터공학 알고리즘 스터디',
        'alice',
        '컴퓨터공학',
        DATE_ADD(CURDATE(), INTERVAL 10 DAY),
        '온라인',
        '6주',
        5,
        '백준, 프로그래머스 위주 알고리즘 풀이 스터디',
        12,
        'https://open.kakao.com/o/algo'
    ),
    (
        '경영 전략 케이스 스터디',
        'bob',
        '경영',
        DATE_ADD(CURDATE(), INTERVAL 7 DAY),
        '오프라인',
        '4주',
        6,
        '경영대 케이스 토론 중심 스터디',
        7,
        'https://open.kakao.com/o/mba'
    ),
    -- 🟡 마감임박 (인원 1명 남음)
    (
        '경제 시사 토론 스터디',
        'charlie',
        '경제',
        DATE_ADD(CURDATE(), INTERVAL 5 DAY),
        '혼합',
        '5주',
        3,
        '주요 경제 이슈 토론 및 발표',
        22,
        'https://open.kakao.com/o/economy'
    ),
    -- 🟡 마감임박 (마감일 내일)
    (
        '교육학 임용 대비 스터디',
        'daisy',
        '교육',
        DATE_ADD(CURDATE(), INTERVAL 1 DAY),
        '온라인',
        '8주',
        4,
        '교육학 논술 대비 스터디',
        30,
        'https://open.kakao.com/o/edu'
    ),
    -- 🔴 모집마감 (인원 꽉 참)
    (
        '디자인 포트폴리오 스터디',
        'eva',
        '디자인',
        DATE_ADD(CURDATE(), INTERVAL 3 DAY),
        '오프라인',
        '6주',
        2,
        'UX/UI 포트폴리오 피드백 중심',
        41,
        'https://open.kakao.com/o/design'
    ),
    -- 🔴 모집마감 (마감일 지남)
    (
        '면접 대비 스터디',
        'frank',
        '면접',
        DATE_SUB(CURDATE(), INTERVAL 2 DAY),
        '혼합',
        '3주',
        5,
        '모의면접 + 피드백 스터디',
        55,
        'https://open.kakao.com/o/interview'
    ),
    -- 🔵 모집중 (다른 분야들)
    (
        '전기전자 회로이론 스터디',
        'grace',
        '전기·전자',
        DATE_ADD(CURDATE(), INTERVAL 14 DAY),
        '온라인',
        '6주',
        6,
        '회로이론 문제 풀이 중심',
        9,
        'https://open.kakao.com/o/circuit'
    ),
    (
        '기계공학 열역학 스터디',
        'henry',
        '기계',
        DATE_ADD(CURDATE(), INTERVAL 12 DAY),
        '오프라인',
        '5주',
        5,
        '열역학 기본 개념 정리',
        3,
        'https://open.kakao.com/o/thermo'
    ),
    (
        '화학 전공 기초 스터디',
        'irene',
        '화학',
        DATE_ADD(CURDATE(), INTERVAL 9 DAY),
        '온라인',
        '4주',
        4,
        '일반화학 복습 스터디',
        15,
        'https://open.kakao.com/o/chem'
    ),
    (
        '생명과학 실험 스터디',
        'jack',
        '생명',
        DATE_ADD(CURDATE(), INTERVAL 11 DAY),
        '혼합',
        '6주',
        5,
        '생명과학 실험 리포트 대비',
        18,
        'https://open.kakao.com/o/bio'
    );
/* 스터디 참여자 저장 테이블 */
CREATE TABLE IF NOT EXISTS study_participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studyId INT NOT NULL,
    userId VARCHAR(100) NOT NULL,
    joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studyId) REFERENCES studies(id) ON DELETE CASCADE
);
-- 🔵 모집중 (여유 있음)
INSERT INTO study_participants (studyId, userId)
VALUES (1, 'user1'),
    (1, 'user2');
INSERT INTO study_participants (studyId, userId)
VALUES (2, 'user3');
-- 🟡 마감임박 (3명 중 2명 참여 → 1자리 남음)
INSERT INTO study_participants (studyId, userId)
VALUES (3, 'user4'),
    (3, 'user5');
-- 🟡 마감임박 (마감일 임박)
INSERT INTO study_participants (studyId, userId)
VALUES (4, 'user6'),
    (4, 'user7');
-- 🔴 모집마감 (정원 초과 X, 딱 맞게)
INSERT INTO study_participants (studyId, userId)
VALUES (5, 'user8'),
    (5, 'user9');
-- 🔴 모집마감 (마감일 지남)
INSERT INTO study_participants (studyId, userId)
VALUES (6, 'user10'),
    (6, 'user11'),
    (6, 'user12');
-- 🔵 모집중 (다양한 분야)
INSERT INTO study_participants (studyId, userId)
VALUES (7, 'user13'),
    (8, 'user14'),
    (9, 'user15'),
    (10, 'user16');