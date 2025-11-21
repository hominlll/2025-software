import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import CategoryMenu from './components/CategoryMenu';
import Banner from './components/Banner';
import MentorSection from './components/MentorSection';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import Community from "./pages/Community";
import PostDetail from "./components/PostDetail";
import Study from "./pages/Study";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>

        {/* 홈(멘토링 메인) */}
        <Route
          path="/"
          element={
            <>
              <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              <CategoryMenu />
              <Banner />
              <Home />
            </>
          }
        />

         {/* 스터디 메인 */}
        <Route
          path="/study"
          element={
            <>
              <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              {/* 스터디에는 CategoryMenu, Banner가 필요 없다면 생략 가능 */}
              <Study />
            </>
          }
        />
        
        {/* 커뮤니티 */}
        <Route
          path="/community"
          element={
            <>
              <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              <Community />
            </>
          }
        />

        <Route path="/community/:id" element={<PostDetail />} />

        {/* 마이페이지 */}
        <Route
          path="/mypage"
          element={isLoggedIn ? <MyPage /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
