import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StudyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [study, setStudy] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // 스터디 상세 정보 불러오기
  const fetchStudy = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/studies/${id}`);
      setStudy(res.data);
      setComments(res.data.commentsList || []);
      setLoading(false);
    } catch (err) {
      console.error("스터디 상세 불러오기 오류:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudy();
  }, [id]);

  // 댓글 작성
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/studies/${id}/comments`,
        { text: newComment }
      );
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("댓글 작성 오류:", err);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/studies/${id}/comments/${commentId}`
      );
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("댓글 삭제 오류:", err);
    }
  };

  if (loading) return <p className="text-center py-10">로딩 중...</p>;
  if (!study) return <p className="text-center py-10">스터디를 찾을 수 없습니다.</p>;

  return (
    <div className="w-[70%] mx-auto py-8">
      <button
        className="mb-5 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        ← 뒤로가기
      </button>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        {/* 스터디 정보 */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs bg-blue-100 px-3 py-1 rounded-full text-gray-600">스터디</span>
          <span className="text-xs bg-green-100 px-3 py-1 rounded-full text-gray-600">{study.category || "정보 없음"}</span>
          <span className="text-xs bg-yellow-100 px-3 py-1 rounded-full text-yellow-700">마감임박 🔥</span>
        </div>

        <h1 className="text-2xl font-bold mb-3">{study.studyName || "제목 없음"}</h1>
        <p className="text-gray-500 mb-2">작성자: {study.writer || "정보 없음"} | 조회수: {study.views || 0}</p>
        <p className="text-gray-500 mb-2">마감일: {study.deadline ? new Date(study.deadline).toLocaleDateString() : "미정"}</p>
        <p className="text-gray-500 mb-2">진행 방식: {study.method || "미정"} | 기간: {study.duration || "미정"} | 모집 인원: {study.maxPeople || "미정"}</p>

        {study.tags && study.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {study.tags.split(",").map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">#{tag.trim()}</span>
            ))}
          </div>
        )}

        <p className="text-gray-700 mb-6">{study.description || "설명이 없습니다."}</p>

        <div className="flex gap-4 mb-6">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">참여하기</button>
        </div>

        {/* 댓글 */}
        <div className="border-t pt-4">
          <h2 className="font-semibold mb-3">댓글</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
            />
            <button onClick={handleAddComment} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              등록
            </button>
          </div>

          {comments.length === 0 ? (
            <p className="text-gray-500">등록된 댓글이 없습니다.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {comments.map((comment) => (
                <li key={comment.id} className="p-2 bg-gray-100 rounded flex justify-between items-center">
                  <span>
                    <span className="font-semibold">{comment.writer || "익명"}:</span> {comment.text}
                  </span>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyDetailPage;
