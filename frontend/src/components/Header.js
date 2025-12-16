import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import LoginModal from './LoginModal';

const Header = ({
  isLoggedIn,
  setIsLoggedIn,
  selectedTab,
  setSelectedTab,
  setUserNickname
}) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 특정 페이지에서는 헤더 숨김
  const hiddenPaths = ['/mypage'];
  const isHidden = hiddenPaths.some(path =>
    location.pathname.startsWith(path)
  );
  if (isHidden) return null;

  // 🔹 로그인 성공
  const handleLoginSuccess = (nickname) => {
    setIsLoggedIn(true);
    setUserNickname(nickname);
    setShowModal(false);
  };

  // 🔹 로그아웃
  const handleLogout = () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) return;

    setIsLoggedIn(false);
    setUserNickname('');
    localStorage.removeItem('token');

    const path = location.pathname;

    if (path.startsWith('/community/')) {
      navigate('/community', { replace: true });
    } else {
      navigate('/', { replace: true });
    }

    alert('로그아웃되었습니다.');
    window.location.reload();
  };

  // 🔹 로고 / 멘토링 / 스터디 클릭
  const handleHomeClick = (tab) => {
    setSelectedTab(tab);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-top">
        {/* 로고 */}
        <h1
          className="logo"
          onClick={() => handleHomeClick('mentoring')}
          style={{ cursor: 'pointer' }}
        >
          <img src="/img/logo.png" alt="로고" className="logo-img" />
        </h1>

        {/* 중앙 네비게이션 */}
        <div className="center-nav">
          <button
            className={`center-button ${selectedTab === 'mentoring' ? 'active' : ''}`}
            onClick={() => handleHomeClick('mentoring')}
          >
            <img src="/img/mentoring.png" alt="멘토링" className="center-icon" />
            <span>멘토링</span>
          </button>

          <button
            className={`center-button ${selectedTab === 'study' ? 'active' : ''}`}
            onClick={() => handleHomeClick('study')}
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

        {/* 우측 메뉴 */}
        <nav className="nav">
          {!isLoggedIn ? (
            <button className="login-button" onClick={() => setShowModal(true)}>
              로그인
            </button>
          ) : (
            <>
              <button className="mypage-button" onClick={() => navigate('/mypage')}>
                내 정보
              </button>
              <button className="logout-button" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          )}
        </nav>
      </div>

      {/* 로그인 모달 */}
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
