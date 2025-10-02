import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1 className="logo">Growe</h1>
      <nav className="nav">
        <button className="image-button" onClick={() => alert("메뉴 열기!")}>
          <img src="/img/setting.png" alt="메뉴 버튼" className="button-image" />
        </button>
        <button className="login-button"onClick={() => alert("로그인!")}
          >로그인</button>
      </nav>
    </header>
  );
};

export default Header;
