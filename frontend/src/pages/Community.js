// src/pages/Community.js
import React, { useState, useEffect } from "react";
import axios from "axios";
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

  // ✅ 임시 작성자 ID (나중에 로그인 유저로 교체)
  const currentUserId = "admin";

  // ✅ 처음 로드될 때 DB에서 게시글 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/community/posts")
      .then((res) => {
        // 서버 rows: { id, userId, title, category, content, created_at }
        // → 프론트에서 쓰기 좋게 createdAt 필드로 매핑
        const mapped = res.data.map((p) => ({
          ...p,
          createdAt: p.created_at,
        }));
        setPosts(mapped);
      })
      .catch((err) => {
        console.error("게시글 불러오기 오류:", err);
        alert("게시글을 불러오지 못했습니다 ㅠㅠ");
      });
  }, []);

  // 카테고리 필터
  const filteredPosts = posts.filter((post) =>
    selectedCategory === "전체" ? true : post.category === selectedCategory
  );

  // ✅ 글 작성 → 백엔드로 저장
  const addPost = async (postFromModal) => {
    try {
      // PostModal에서 넘겨주는 값: { title, category, content }
      const body = {
        userId: currentUserId,
        title: postFromModal.title,
        category: postFromModal.category,
        content: postFromModal.content,
      };

      const res = await axios.post(
        "http://localhost:5000/api/community/posts",
        body
      );

      // server.js: { success, post } (post.created_at 포함)
      const savedPost = res.data.post;

      // created_at → createdAt 매핑
      const mappedPost = {
        ...savedPost,
        createdAt: savedPost.created_at,
      };

      // 새 글을 목록 맨 앞에 추가
      setPosts((prev) => [mappedPost, ...prev]);

      // 모달 닫기
      setOpenModal(false);
    } catch (err) {
      console.error("글 작성 오류:", err);
      alert("글 작성에 실패했습니다 ㅠㅠ");
    }
  };

  // (지금은 댓글은 프론트 메모리에만 저장)
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
            onPostClick={(post) => setSelectedPost(post)} // 카드 클릭 시
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
