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

  // 임시 작성자 ID (나중에 로그인 유저로 교체)
  const currentUserId = "admin";

  // 🔍 입력창에 보여지는 텍스트 (타이핑용)
  const [inputText, setInputText] = useState("");

  // 🔍 실제 검색에 사용하는 키워드 (버튼/엔터 눌렀을 때만 업데이트)
  const [searchKeyword, setSearchKeyword] = useState("");

  // ✅ 처음 로드될 때 DB에서 게시글 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/community/posts")
      .then((res) => {
        // 서버 rows: { id, userId, title, category, content, created_at }
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

  // 1차: 카테고리 필터
  const categoryFiltered = posts.filter((post) =>
    selectedCategory === "전체" ? true : post.category === selectedCategory
  );

  // 2차: 검색어 필터 (제목 + 내용) — 여기서는 **searchKeyword**만 사용!
  const finalPosts = categoryFiltered.filter((post) => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return true; // 검색어 없으면 그대로 전체/카테고리만

    const title = (post.title || "").toLowerCase();
    const content = (post.content || "").toLowerCase();

    return title.includes(keyword) || content.includes(keyword);
  });

  // ✅ 검색 버튼 / Enter 눌렀을 때만 필터 적용
  const triggerSearch = () => {
    if (!inputText.trim()) {
      alert("검색어를 입력해주세요.");
      setSearchKeyword(""); // 검색어 비우면 전체 다시 보여줌
      return;
    }
    setSearchKeyword(inputText); // 이 때만 실제 필터링이 걸림
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // form submit 시 새로고침 방지
    triggerSearch();
  };

  // ✅ 글 작성 → 백엔드로 저장
  const addPost = async (postFromModal) => {
    try {
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

      const savedPost = res.data.post;

      const mappedPost = {
        ...savedPost,
        createdAt: savedPost.created_at,
      };

      setPosts((prev) => [mappedPost, ...prev]);
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
    <div className="w-full max-w-5xl mx-auto mt-6 px-3">
      {/* 🔍 검색창 */}
      <form
        onSubmit={handleSearchSubmit}
        className="w-full flex justify-center mb-6"
      >
        <div className="flex items-center w-full max-w-[600px] h-14 rounded-full border border-gray-300 bg-white overflow-hidden shadow-sm">
          <input
            type="text"
            className="flex-1 h-full px-4 text-sm md:text-base outline-none border-none bg-transparent"
            placeholder="검색어를 입력하세요..."
            value={inputText} // 입력은 무조건 이 state만 변경
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type="submit"
            className="w-12 h-12 mr-2 rounded-full bg-[#27ae60] hover:bg-[#219150] flex items-center justify-center transition-colors"
          >
            <img
              src="/img/search.svg"
              alt="검색"
              className="w-5 h-5 object-contain"
            />
          </button>
        </div>
      </form>

      <div className="flex gap-8 items-start">
        <div className="w-32 shrink-0 -mt-[60px]">
          <CategoryBar
            selected={selectedCategory}
            setSelected={setSelectedCategory}
          />
        </div>

        <div className="flex-1 -mt-6">
          <PostList
            posts={finalPosts} // ⭐ 카테고리 + (버튼 눌러서 확정된) 검색만 적용된 리스트
            onPostClick={(post) => setSelectedPost(post)}
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
