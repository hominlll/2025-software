import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import CategoryMenu from './components/CategoryMenu';
import Banner from './components/Banner';
import MentorSection from './components/MentorSection';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import Community from "./pages/Community";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>

        {/* 홈 */}
        <Route
          path="/"
          element={
            <>
              <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              <CategoryMenu />
              <Banner />
              <MentorSection />
              <Home />
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
