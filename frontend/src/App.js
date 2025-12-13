// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import CategoryMenu from "./components/CategoryMenu";
import SearchBar from "./components/SearchBar";
import StudyBanner from "./components/StudyBanner";
import MentorBanner from "./components/MentorBanner";
import StudySection from "./components/StudySection";
import MentorSection from "./components/MentorSection";
import MyPage from "./pages/MyPage";
import Community from "./pages/Community";
import PostDetail from "./components/PostDetail";
import MentorDetailPage from "./pages/MentorDetailPage";
import MentorEnrollPage from "./pages/MentorEnrollPage";
import StudyDetailPage from "./pages/StudyDetailPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("mentoring");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // 🔥 검색 상태
  const [searchText, setSearchText] = useState("");
  const [searchResetKey, setSearchResetKey] = useState(0); // ⭐ 강제 리셋 트리거

  // 🔥 검색 실행
  const handleSearch = (text) => {
    setSearchText(text);
    setSearchResetKey((prev) => prev + 1); // 태그 검색 해제 신호
  };

  // 🔥 전체 초기화 (로고 클릭 등)
  const resetAll = () => {
    setSearchText("");
    setSelectedCategory(null);
    setSelectedStatus(null);
    setSearchResetKey((prev) => prev + 1);
  };

  return (
    <Router>
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        setUserNickname={setUserNickname}
        setCurrentUserId={setCurrentUserId}
        resetAll={resetAll} // ⭐ 추가
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              {(selectedTab === "study" || selectedTab === "mentoring") && (
                <SearchBar
                  key={searchResetKey} // 🔥 강제 리렌더
                  placeholder={selectedTab === "study" ? "스터디 검색..." : "멘토링 검색..."}
                  onSearch={handleSearch}
                />
              )}

              <CategoryMenu setSelectedCategory={setSelectedCategory} />

              {selectedTab === "study" && (
                <>
                  <StudyBanner userNickname={userNickname} />
                  <StudySection
                    selectedCategory={selectedCategory}
                    selectedStatus={selectedStatus}
                    searchText={searchText}
                    userNickname={userNickname}
                    currentUserId={currentUserId}
                  />
                </>
              )}

              {selectedTab === "mentoring" && (
                <>
                  <MentorBanner />
                  <MentorSection
                    selectedCategory={selectedCategory}
                    searchText={searchText}
                    resetKey={searchResetKey} // ⭐ 태그 검색 해제 신호
                  />
                </>
              )}
            </>
          }
        />

        <Route path="/study/:id" element={<StudyDetailPage />} />
        <Route path="/mentor/:id" element={<MentorDetailPage />} />
        <Route path="/mentor/:id/enrollment" element={<MentorEnrollPage />} />

        <Route
          path="/community"
          element={
            <Community
              isLoggedIn={isLoggedIn}
              currentUserId={currentUserId}
              userNickname={userNickname}
            />
          }
        />
        <Route
          path="/community/:id"
          element={
            <PostDetail
              isLoggedIn={isLoggedIn}
              currentUserId={currentUserId}
              userNickname={userNickname}
            />
          }
        />

        <Route
          path="/mypage"
          element={isLoggedIn ? (
            <MyPage
              userNickname={userNickname}
              setUserNickname={setUserNickname}
              currentUserId={currentUserId}
            />
          ) : (
            <Navigate to="/" replace />
          )}
        />
      </Routes>
    </Router>
  );
}

export default App;
