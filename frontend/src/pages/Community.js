// src/pages/Community.js
import React, { useState } from "react";
import CategoryBar from "../components/CategoryBar";
import PostList from "../components/PostList";
import PostModal from "../components/PostModal";

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // 선택된 카테고리에 맞게 필터링
  const filteredPosts = posts.filter((post) =>
    selectedCategory === "전체" ? true : post.category === selectedCategory
  );

  const addPost = (post) => {
    setPosts([...posts, post]);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 px-3">
      {/* 왼쪽: 카테고리 / 오른쪽: 게시글 리스트 */}
      <div className="flex gap-8 items-start">
        {/* 카테고리 세로 메뉴 */}
        <div className="w-32 shrink-0">
          <CategoryBar
            selected={selectedCategory}
            setSelected={setSelectedCategory}
          />
        </div>

        {/* 게시글 리스트 */}
        <div className="flex-1">
          <PostList posts={filteredPosts} />
        </div>
      </div>

      {/* 글쓰기 버튼 */}
      <button
        type="button"
        onClick={() => setOpenModal(true)}
        className="community-write-btn fixed bottom-10 right-10
                   bg-green-600 text-white px-5 py-3 rounded-full
                   shadow-lg hover:bg-green-700 transition"
      >
        글 작성하기 +
      </button>

      {/* 글 작성 모달 */}
      {openModal && (
        <PostModal onClose={() => setOpenModal(false)} onSubmit={addPost} />
      )}
    </div>
  );
}
