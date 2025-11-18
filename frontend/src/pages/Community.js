// src/pages/Community.js
import React, { useState } from "react";
import CategoryBar from "../components/CategoryBar";
import PostList from "../components/PostList";
import PostModal from "../components/PostModal";
import PostDetail from "../components/PostDetail";

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // 클릭된 게시글
  const [selectedPost, setSelectedPost] = useState(null);

  // 게시글별 댓글: { [postId]: [comment, ...] }
  const [commentsByPost, setCommentsByPost] = useState({});

  const filteredPosts = posts.filter((post) =>
    selectedCategory === "전체" ? true : post.category === selectedCategory
  );

  const addPost = (postFromModal) => {
    const newPost = {
      ...postFromModal,
      id: Date.now(), // 간단한 id
    };
    setPosts((prev) => [...prev, newPost]);
  };

  const addCommentToPost = (postId, content) => {
    setCommentsByPost((prev) => {
      const prevComments = prev[postId] || [];
      const newComment = {
        id: Date.now(),
        content,
        createdAt: new Date().toISOString(),
      };
      return {
        ...prev,
        [postId]: [...prevComments, newComment],
      };
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 px-3">
      <div className="flex gap-8 items-start">
        <div className="w-32 shrink-0">
          <CategoryBar
            selected={selectedCategory}
            setSelected={setSelectedCategory}
          />
        </div>

        <div className="flex-1">
          <PostList
            posts={filteredPosts}
            onPostClick={(post) => setSelectedPost(post)}  // ★ 카드 클릭 시
          />
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

      {/* 게시글 상세 + 댓글 모달 */}
      {selectedPost && (
        <PostDetail
          post={selectedPost}
          comments={commentsByPost[selectedPost.id] || []}
          onAddComment={(content) => addCommentToPost(selectedPost.id, content)}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}

