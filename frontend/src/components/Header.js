import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [selected, setSelected] = useState('mentoring'); // 선택된 버튼: 'study' 또는 'mentoring'

  return (
    <header className="header">
      <div className="header-top">
        {/* 왼쪽: 로고 */}
        <h1 className="logo">Growe</h1>

        {/* 가운데: 스터디/멘토링 */}
        <div className="center-nav">
          <button
            className={`center-button ${selected === 'mentoring' ? 'active' : ''}`}
            onClick={() => setSelected('mentoring')}
          >
            <img src="/img/mentoring.png" alt="멘토링" className="center-icon" />
            <span>멘토링</span>
          </button>

          <button
            className={`center-button ${selected === 'study' ? 'active' : ''}`}
            onClick={() => setSelected('study')}
          >
            <img src="/img/study.png" alt="스터디" className="center-icon" />
            <span>스터디</span>
          </button>
        </div>

        {/* 오른쪽: 설정 + 로그인 */}
        <nav className="nav">
          <button className="image-button" onClick={() => alert("메뉴 열기!")}>
            <img src="/img/setting.png" alt="설정" className="button-image" />
          </button>
          <button className="login-button" onClick={() => alert("로그인!")}>
            로그인
          </button>
        </nav>
      </div>

      {/* 검색창: header-top 아래 */}
      <div className="search-container">
        <input type="text" className="search-input" placeholder="검색어를 입력하세요..." />
        <button className="search-button" onClick={() => alert("검색!")}>
          <img src="/img/search.svg" alt="검색" />
        </button>
      </div>
    </header>
  );
};

export default Header;
