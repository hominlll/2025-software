import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import LoginModal from './LoginModal';

const Header = ({ isLoggedIn, setIsLoggedIn, selectedTab, setSelectedTab }) => {
  const [showModal, setShowModal] = useState(false); // 모달 상태만 내부에서 관리
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("로그아웃되었습니다.");
  };

  const handleMyPage = () => {
    navigate('/mypage');
  };

  return (
    <header className="header">
      <div className="header-top">
        <h1 className="logo" onClick={() => navigate('/')} style={{ cursor: "pointer" }}>
          <img src="/img/logo.png" alt="로고" className="logo-img" />
        </h1>

        <div className="center-nav">
          <button
            className={`center-button ${selectedTab === 'mentoring' ? 'active' : ''}`}
            onClick={() => {
              setSelectedTab('mentoring');
              navigate('/');
            }}
          >
            <img src="/img/mentoring.png" alt="멘토링" className="center-icon" />
            <span>멘토링</span>
          </button>

          <button
            className={`center-button ${selectedTab === 'study' ? 'active' : ''}`}
            onClick={() => {
              setSelectedTab('study');
              navigate('/');
            }}
          >
            <img src="/img/study.png" alt="스터디" className="center-icon" />
            <span>스터디</span>
          </button>

          <button
            className={`center-button ${selectedTab === 'community' ? 'active' : ''}`}
            onClick={() => {
              setSelectedTab('community');
              navigate('/community');
            }}
          >
            <img src="/img/community.png" alt="커뮤니티" className="center-icon" />
            <span>커뮤니티</span>
          </button>
        </div>

        <nav className="nav">
          {!isLoggedIn ? (
            <button className="login-button" onClick={() => setShowModal(true)}>
              로그인
            </button>
          ) : (
            <>
              <button className="mypage-button" onClick={handleMyPage}>
                내 정보
              </button>
              <button className="logout-button" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          )}
        </nav>
      </div>

      {showModal && (
        <LoginModal
          onClose={() => setShowModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </header>
  );
};

export default Header;
