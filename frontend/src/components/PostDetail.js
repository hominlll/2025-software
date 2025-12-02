// src/components/PostDetail.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";

const formatPostTime = (createdAt) => {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).toString().padStart(2, "0");
  const minute = String(d.getMinutes()).toString().padStart(2, "0");
  return `${year}. ${month}. ${day} ${hour}:${minute}`;
};

const formatCommentTime = (createdAt) => {
  const d = new Date(createdAt);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).toString().padStart(2, "0");
  const minute = String(d.getMinutes()).toString().padStart(2, "0");
  return `${month}/${day} ${hour}:${minute}`;
};

export default function PostDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams(); // 필요 없으면 지워도 됨

  const post = state?.post;

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  // ✅ DB에서 댓글 불러오기
  useEffect(() => {
    if (!post) return; // 포스트 정보 없으면 아무 것도 안 함

    axios
      .get(`http://localhost:5000/api/community/posts/${post.id}/comments`)
      .then((res) => {
        // created_at → createdAt 으로 키만 바꿔서 쓰기
        const mapped = res.data.map((c) => ({
          id: c.id,
          content: c.content,
          createdAt: c.created_at,
          userId: c.userId,
        }));
        setComments(mapped);
      })
      .catch((err) => {
        console.error("댓글 불러오기 오류:", err);
      });
  }, [post]);
;

  if (!post) {
    return (
      <>
        <Header />
        <div className="w-full max-w-4xl mx-auto mt-24 px-3">
          <p className="text-center text-gray-500 py-10">
            이 게시글 정보를 찾을 수 없습니다. (새로고침 되었거나, 주소를 직접 입력했을 수 있어요)
          </p>
          <div className="flex justify-center">
            <button
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm"
              onClick={() => navigate("/community")}
            >
              커뮤니티로 돌아가기
            </button>
          </div>
        </div>
      </>
    );
  }

  const handleAddComment = async () => {
    if (!commentInput.trim() || !post) return;

    try {
      const body = {
        userId: null, // 나중에 로그인 붙이면 localStorage에서 userId 꺼내서 넣으면 됨
        content: commentInput.trim(),
      };

      const res = await axios.post(
        `http://localhost:5000/api/community/posts/${post.id}/comments`,
        body
      );

      const saved = res.data; // 서버에서 돌려준 댓글

      const newComment = {
        id: saved.id,
        content: saved.content,
        createdAt: saved.created_at,
        userId: saved.userId,
      };

      setComments((prev) => [...prev, newComment]);
      setCommentInput("");
    } catch (err) {
      console.error("댓글 작성 오류:", err);
      alert("댓글 작성에 실패했습니다 ㅠㅠ");
    }
  };


  return (
    <>
      <Header />

      <div className="w-full max-w-4xl mx-auto mt-12 mb-12 px-3">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border">
          {/* 상단: 글 정보 */}
          <div className="px-8 pt-8 pb-6 border-b">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full border border-green-500 text-green-700 font-semibold">
                  {post.category}
                </span>
              </div>
              <button
                className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                onClick={() => navigate(-1)}
              >
                뒤로가기
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>

            <div className="text-xs text-gray-400 flex items-center gap-2 mb-4">
              <span>{formatPostTime(post.createdAt)}</span>
              <span>·</span>
              <span>조회 0</span>
            </div>

            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {/* 댓글 영역 */}
          <div className="px-8 pt-6 pb-8">
            <h3 className="font-semibold mb-3">댓글 {comments.length}</h3>

            {/* ✅ 댓글 리스트 (위쪽) */}
            <div className="space-y-3 mb-6">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-400">
                  아직 등록된 댓글이 없습니다.
                </p>
              ) : (
                comments.map((c) => (
                  <div
                    key={c.id}
                    className="border rounded-lg px-4 py-3 text-sm bg-white"
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                        익명
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">익명</span>
                            <span className="text-xs text-gray-400">
                              {formatCommentTime(c.createdAt)}
                            </span>
                          </div>                        
                        </div>
                        <p className="whitespace-pre-line text-gray-800 mt-1">
                          {c.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ✅ 댓글 작성창 (맨 아래) */}
            <div className="border rounded-lg bg-gray-50 p-4">
              <textarea
                className="w-full border rounded-lg p-2 h-20 resize-none text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="댓글을 작성해보세요."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
                  onClick={handleAddComment}
                >
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
