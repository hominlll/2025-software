// src/components/PostDetail.js
import React, { useState } from "react";
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
  const { id } = useParams();

  const post = state?.post;

  // ✅ 훅은 항상 컴포넌트 최상단에서!
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  // post 없을 때는 조기 return (여기서는 훅 호출 X)
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

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    const newComment = {
      id: Date.now(),
      content: commentInput.trim(),
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    setCommentInput("");
  };

  return (
    <>
      <Header />

      <div className="w-full max-w-4xl mx-auto mt-24 px-3">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border">
          {/* 상단: 글 정보 */}
          <div className="px-8 pt-8 pb-6 border-b">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full border border-green-500 text-green-700 font-semibold">
                  질문
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
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

            {/* 댓글 입력 */}
            <div className="border rounded-lg bg-gray-50 p-4 mb-6">
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

            {/* 댓글 리스트 */}
            <div className="space-y-3">
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
                          <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-600">
                            <span>👍</span>
                            <span>0</span>
                          </button>
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
          </div>
        </div>
      </div>
    </>
  );
}
