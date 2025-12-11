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
import StudyDetailPage from "./pages/StudyDetailPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("mentoring");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [refresh, setRefresh] = useState(0);

  return (
    <Router>
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        setUserNickname={setUserNickname}
        setCurrentUserId={setCurrentUserId}
      />

      <Routes>
        {/* 홈 페이지 */}
        <Route
          path="/"
          element={
            <>
              {(selectedTab === "study" || selectedTab === "mentoring") && (
                <SearchBar
                  placeholder={selectedTab === "study" ? "스터디 검색..." : "멘토링 검색..."}
                  onSearch={setSearchText}
                />
              )}

              <CategoryMenu setSelectedCategory={setSelectedCategory} />

              {selectedTab === "study" && (
                <>
                  <StudyBanner userNickname={userNickname} setRefresh={setRefresh} />
                  <div className="w-[70%] mx-auto flex gap-2 mb-6 justify-start">
                    {["모집중", "마감임박", "모집마감"].map((status) => {
                      let bgColor = "";
                      if (status === "모집중") bgColor = "bg-green-500";
                      else if (status === "마감임박") bgColor = "bg-yellow-500";
                      else if (status === "모집마감") bgColor = "bg-red-500";

                      const isSelected = selectedStatus === status;

                      return (
                        <button
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                          className={`px-4 py-2 rounded-full font-medium border transition 
                            ${isSelected
                              ? `${bgColor} text-white border-none cursor-default`
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                        >
                          {status}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setSelectedStatus(null)}
                      className={`px-4 py-2 rounded-full font-medium border transition 
                        ${selectedStatus === null
                          ? "bg-gray-500 text-white border-none cursor-default"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                      전체
                    </button>
                  </div>

                  <StudySection
                    selectedCategory={selectedCategory}
                    selectedStatus={selectedStatus}
                    searchText={searchText}
                    refresh={refresh}
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
                  />
                </>
              )}
            </>
          }
        />

        {/* 상세 페이지 */}
        <Route path="/study/:id" element={<StudyDetailPage />} />
        <Route path="/mentor/:id" element={<MentorDetailPage />} />

        {/* 커뮤니티 */}
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

        {/* 마이페이지 접근 제한 */}
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
