import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      {/* 상단 로고 + 중앙 버튼 + 메뉴 */}
      <div className="header-top">
        <h1 className="logo">Growe</h1>

        {/* 중앙 스터디/멘토링 버튼 */}
        <div className="top-center-buttons">
          <button className="center-button" onClick={() => alert("스터디 페이지로 이동!")}>
            <img src="/img/study.png" alt="스터디" className="center-icon" />
            스터디
          </button>
          <button className="center-button" onClick={() => alert("멘토링 페이지로 이동!")}>
            <img src="/img/mentoring.png" alt="멘토링" className="center-icon" />
            멘토링
          </button>
        </div>

        <nav className="nav">
          <button className="image-button" onClick={() => alert("메뉴 열기!")}>
            <img src="/img/setting.png" alt="설정" className="button-image" />
          </button>
          <button className="login-button" onClick={() => alert("로그인!")}>
            로그인
          </button>
        </nav>
      </div>

      {/* 검색창은 별도 줄 */}
      <div className="search-wrapper">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="검색어를 입력하세요..."
          />
          <button className="search-button" onClick={() => alert("검색!")}>
            <img src="/img/search.svg" alt="검색" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
