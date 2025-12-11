// src/pages/Community.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryBar from "../components/CategoryBar";
import PostList from "../components/PostList";
import PostModal from "../components/PostModal";
import PostDetail from "../components/PostDetail";

export default function Community({ currentUserId, userNickname, isLoggedIn }) {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);
  const [commentsByPost, setCommentsByPost] = useState({});

  const [inputText, setInputText] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // ✅ 처음 로드될 때 DB에서 게시글 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/community/posts")
      .then((res) => {
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

  const categoryFiltered = posts.filter((post) =>
    selectedCategory === "전체" ? true : post.category === selectedCategory
  );

  const finalPosts = categoryFiltered.filter((post) => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return true;

    const title = (post.title || "").toLowerCase();
    const content = (post.content || "").toLowerCase();

    return title.includes(keyword) || content.includes(keyword);
  });

  const triggerSearch = () => {
    if (!inputText.trim()) {
      setSearchKeyword("");
      return;
    }
    setSearchKeyword(inputText);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    triggerSearch();
  };

  const addPost = async (postFromModal) => {
    if (!isLoggedIn) {
      alert("로그인 후 글을 작성할 수 있습니다.");
      return;
    }

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

  const addCommentToPost = (postId, content) => {
    if (!isLoggedIn) {
      alert("로그인 후 댓글을 작성할 수 있습니다.");
      return;
    }

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
      {/* 검색창 */}
      <form
        onSubmit={handleSearchSubmit}
        className="w-full flex justify-center mb-6"
      >
        <div className="flex items-center w-full max-w-[600px] h-14 rounded-full border border-gray-300 bg-white overflow-hidden shadow-sm">
          <input
            type="text"
            className="flex-1 h-full px-4 text-sm md:text-base outline-none border-none bg-transparent"
            placeholder="검색어를 입력하세요..."
            value={inputText}
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
        <div className="w-32 shrink-0">
          <CategoryBar
            selected={selectedCategory}
            setSelected={setSelectedCategory}
          />
        </div>

        <div className="flex-1 -mt-6">
          <PostList
            posts={finalPosts}
            onPostClick={(post) => setSelectedPost(post)}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpenModal(true)}
        className="community-write-btn fixed bottom-10 right-10
                   bg-green-600 text-white px-5 py-3 rounded-full
                   shadow-lg hover:bg-green-700 transition"
      >
        글 작성하기 +
      </button>

      {openModal && (
        <PostModal onClose={() => setOpenModal(false)} onSubmit={addPost} />
      )}

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
