import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import CategoryMenu from './components/CategoryMenu';
import SearchBar from './components/SearchBar'; 
import MentorBanner from './components/MentorBanner';
import StudyBanner from './components/StudyBanner'; // 추가
import MentorSection from './components/MentorSection';
import Home from './pages/Home';
import MyPage from './pages/MyPage';
import Community from "./pages/Community";
import PostDetail from "./components/PostDetail";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedTab, setSelectedTab] = useState('mentoring');

  return (
    <Router>
      <Routes>

        {/* 홈 */}
        <Route
          path="/"
          element={
            <>
              <Header 
                isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />

              {(selectedTab === "mentoring" || selectedTab === "study") && (
                <SearchBar selectedTab={selectedTab} />
              )}

              <CategoryMenu />

              {/* 배너 분기 */}
              {selectedTab === "mentoring" && <MentorBanner />}
              {selectedTab === "study" && <StudyBanner />}

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
              <Header 
                isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
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
