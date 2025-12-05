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
import StudyDetailPage from "./pages/StudyDetailPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState("");
  const [selectedTab, setSelectedTab] = useState("study");

  // ⭐ 카테고리 선택 상태
  const [selectedCategory, setSelectedCategory] = useState(null);

  // ⭐ StudySection 새로고침 상태 추가!!
  const [refresh, setRefresh] = useState(0);

  return (
    <Router>
      <Routes>
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

              <CategoryMenu setSelectedCategory={setSelectedCategory} />

              {selectedTab === "study" && (
                <>
                  {/* refresh 업데이트용 setRefresh 전달 */}
                  <StudyBanner
                    userNickname={userNickname}
                    setRefresh={setRefresh}
                  />

                  {/* refresh 값 전달 → 스터디 목록 즉시 갱신 */}
                  <StudySection
                    selectedCategory={selectedCategory}
                    refresh={refresh}
                  />
                </>
              )}

              {selectedTab === "mentoring" && (
                <>
                  <MentorBanner />
                  <MentorSection selectedCategory={selectedCategory} />
                </>
              )}
            </>
          }
        />

        <Route
          path="/study/:id"
          element={
            <>
              <Header
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                setUserNickname={setUserNickname}
              />
              <StudyDetailPage />
            </>
          }
        />

        <Route path="/mentor/:id" element={<MentorDetailPage />} />

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

        <Route
          path="/mypage"
          element={isLoggedIn ? <MyPage /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
