import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import LoginModal from './LoginModal';

const Header = ({ isLoggedIn, setIsLoggedIn, selectedTab, setSelectedTab, setUserNickname }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 특정 페이지에서는 헤더 숨김 (예: MyPage, PostDetail 등)
  const hiddenPaths = ['/mypage']; // 필요 시 경로 추가
  const isHidden = hiddenPaths.some(path => location.pathname.startsWith(path));
  if (isHidden) return null; // 해당 페이지에서는 Header 렌더링 안 함

  // ⭐ 로그인 성공 시 닉네임 상태 업데이트
  const handleLoginSuccess = (nickname) => {
    setIsLoggedIn(true);
    setUserNickname(nickname);
    setShowModal(false);
  };

  // 🔹 로그아웃 처리
  const handleLogout = () => {
    if (!window.confirm("로그아웃 하시겠습니까?")) return;

    // 1. 로그인 상태 초기화
    setIsLoggedIn(false);
    setUserNickname("");
    localStorage.removeItem("token"); // JWT 삭제

    // 2. 현재 페이지 확인 후 이동
    const path = location.pathname;

    if (path.startsWith("/community/")) {
      navigate("/community", { replace: true }); // 커뮤니티 상세 -> 커뮤니티 메인
    } else if (path.startsWith("/study/")) {
      navigate("/", { replace: true }); // 스터디 상세 -> 스터디 메인
    } else {
      navigate("/", { replace: true }); // 그 외 페이지는 홈으로
    }

    alert("로그아웃되었습니다.");
  };

  // 🔹 내 정보 페이지 이동
  const handleMyPage = () => {
    navigate('/mypage');
  };

  return (
    <header className="header">
      <div className="header-top">
        {/* 로고 클릭 시 홈 이동 */}
        <h1
          className="logo"
          onClick={() => { setSelectedTab('mentoring'); navigate('/'); }}
          style={{ cursor: "pointer" }}
        >
          <img src="/img/logo.png" alt="로고" className="logo-img" />
        </h1>

        {/* 중앙 네비게이션 */}
        <div className="center-nav">
          <button
            className={`center-button ${selectedTab === 'mentoring' ? 'active' : ''}`}
            onClick={() => { setSelectedTab('mentoring'); navigate('/'); }}
          >
            <img src="/img/mentoring.png" alt="멘토링" className="center-icon" />
            <span>멘토링</span>
          </button>

          <button
            className={`center-button ${selectedTab === 'study' ? 'active' : ''}`}
            onClick={() => { setSelectedTab('study'); navigate('/'); }}
          >
            <img src="/img/study.png" alt="스터디" className="center-icon" />
            <span>스터디</span>
          </button>

          <button
            className={`center-button ${selectedTab === 'community' ? 'active' : ''}`}
            onClick={() => { setSelectedTab('community'); navigate('/community'); }}
          >
            <img src="/img/community.png" alt="커뮤니티" className="center-icon" />
            <span>커뮤니티</span>
          </button>
        </div>

        {/* 우측 로그인 / 내 정보 / 로그아웃 */}
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
