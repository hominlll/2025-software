import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import LoginModal from './LoginModal';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [selected, setSelected] = useState('mentoring');
  const [showModal, setShowModal] = useState(false); // 모달 상태만 내부에서 관리
  const navigate = useNavigate();

  // 로그인 성공 시 실행
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowModal(false);
  };

  // 로그아웃 시 실행
  const handleLogout = () => {
    setIsLoggedIn(false);
    alert('로그아웃되었습니다.');
  };

  // 마이페이지 이동
  const handleMyPage = () => {
    navigate('/mypage');
  };

  // ✅ 로고 클릭 시 메인 화면으로 이동
  const handleLogoClick = () => {
    navigate('/'); // 메인 화면 경로에 맞게 수정 (예: '/main')
  };

  return (
    <header className="header">
      <div className="header-top">
        {/* 왼쪽: 로고 */}
        <h1
          className="logo"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }} // 마우스 올렸을 때 손가락 모양
        >
          <img src="/img/logo.png" alt="로고" className="logo-img" />
        </h1>

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

        {/* 오른쪽: 설정 + 로그인/로그아웃 */}
        <nav className="nav">
          <button className="image-button" onClick={() => navigate('/community')}>
            <img src="/img/setting.png" alt="설정" className="button-image" />
          </button>

          {/* 로그인 상태에 따라 표시되는 버튼 변경 */}
          {!isLoggedIn ? (
            <button className="login-button" onClick={() => setShowModal(true)}>
              로그인
            </button>
          ) : (
            <>
              {/* 마이페이지 이동 버튼 */}
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

      {/* 검색창 */}
      <div className="search-container">
        <input type="text" className="search-input" placeholder="검색어를 입력하세요..." />
        <button className="search-button" onClick={() => alert('검색!')}>
          <img src="/img/search.svg" alt="검색" />
        </button>
      </div>

      {/* 로그인 모달 표시 */}
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
