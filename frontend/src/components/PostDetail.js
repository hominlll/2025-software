import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const formatPostTime = (createdAt) => {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${year}. ${month}. ${day} ${hour}:${minute}`;
};

const formatCommentTime = (createdAt) => {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hour}:${minute}`;
};

export default function PostDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const [post, setPost] = useState(state?.post || null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  // 글 데이터 불러오기
  useEffect(() => {
    if (post) return;
    axios
      .get(`http://localhost:5000/api/community/posts/${id}`)
      .then((res) => {
        if (res.data.success) setPost(res.data.post);
      })
      .catch((err) => console.error("글 불러오기 오류:", err));
  }, [id, post]);

  // 댓글 불러오기
  useEffect(() => {
    if (!post) return;
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/api/community/posts/${post.id}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setComments(res.data)) // 서버에서 displayName 포함
      .catch((err) => console.error("댓글 불러오기 오류:", err));
  }, [post]);

  // 댓글 작성
  const handleAddComment = async () => {
    if (!commentInput.trim() || !post) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/community/posts/${post.id}/comments`,
        { content: commentInput.trim() }, // userId는 JWT에서 처리
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [...prev, res.data]);
      setCommentInput("");
    } catch (err) {
      console.error("댓글 작성 오류:", err);
      alert("댓글 작성에 실패했습니다 ㅠㅠ");
    }
  };

  if (!post) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-24 px-3">
        <p className="text-center text-gray-500 py-10">
          이 게시글 정보를 찾을 수 없습니다. (주소를 직접 입력했거나 새로고침 되었습니다)
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
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 mb-12 px-3">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border">
        <div className="px-8 pt-8 pb-6 border-b">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs px-2 py-1 rounded-full border border-green-500 text-green-700 font-semibold">
              {post.category}
            </span>
            <button
              className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
              onClick={() => navigate(-1)}
            >
              뒤로가기
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-2">{post.title}</h2>

          <div className="text-xs text-gray-400 flex items-center gap-2 mb-4">
            <span>{formatPostTime(post.created_at)}</span>
          </div>

          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
        </div>

        <div className="px-8 pt-6 pb-8">
          <h3 className="font-semibold mb-3">댓글 {comments.length}</h3>
          <div className="space-y-3 mb-6">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-400">등록된 댓글이 없습니다.</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="border rounded-lg px-4 py-3 text-sm bg-white">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 flex-shrink-0 whitespace-nowrap overflow-hidden text-ellipsis">
                      {c.displayName}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col mb-1">
                        <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                          {c.displayName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatCommentTime(c.createdAt)}
                        </span>
                      </div>
                      <p className="whitespace-pre-line text-gray-800 mt-1">{c.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

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
  );
}
