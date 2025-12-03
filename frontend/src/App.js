// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import CategoryMenu from "./components/CategoryMenu";
import SearchBar from "./components/SearchBar";
import StudyBanner from "./components/StudyBanner";
import MyPage from "./pages/MyPage";
import Community from "./pages/Community";
import PostDetail from "./components/PostDetail";
import MentorDetailPage from "./pages/MentorDetailPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState("");
  const [selectedTab, setSelectedTab] = useState("study");

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
                setUserNickname={setUserNickname}
              />

              {(selectedTab === "mentoring" || selectedTab === "study") && (
                <SearchBar selectedTab={selectedTab} />
              )}

              <CategoryMenu />

              {/* StudyBanner에 userNickname 전달 */}
              <StudyBanner userNickname={userNickname} />
            </>
          }
        />

        {/* 멘토 상세 페이지 */}
        <Route path="/mentor/:id" element={<MentorDetailPage />} />

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
                setUserNickname={setUserNickname}
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
