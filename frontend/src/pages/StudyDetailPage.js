import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StudyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserNickname, setCurrentUserNickname] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.post(
          "http://localhost:5000/api/user-info",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setCurrentUserNickname(res.data.user.nickname);
        }
      } catch (err) {
        console.error("유저 정보 불러오기 오류:", err);
      }
    };

    const fetchStudy = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/studies/${id}`);
        setStudy(res.data);
      } catch {
        setStudy(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
    fetchStudy();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.delete(
        `http://localhost:5000/api/studies/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        alert("스터디가 삭제되었습니다.");
        navigate(-1);
      } else {
        alert("삭제 실패: " + res.data.message);
      }
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return <p className="text-center py-10">로딩 중...</p>;

  if (!study)
    return <p className="text-center py-10">스터디를 찾을 수 없습니다.</p>;

  return (
    <div className="w-[70%] mx-auto py-8">

      {/* 뒤로가기 + 삭제 버튼을 양 끝으로 배치 */}
      <div className="flex items-center justify-between mb-5">
        <button
          className="px-4 py-2 bg-green-500 rounded hover:bg-green-300"
          onClick={() => navigate(-1)}
        >
          ← 뒤로가기
        </button>

        {currentUserNickname &&
          study.writer &&
          currentUserNickname.trim().toLowerCase() ===
            study.writer.trim().toLowerCase() && (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-300"
              onClick={handleDelete}
            >
              스터디 삭제
            </button>
          )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-3">{study.studyName}</h1>

        {/* 상단 정보 */}
        <div className="flex flex-wrap items-center space-x-6 text-gray-600 text-sm mb-6 border-b border-gray-300 pb-1">
          <span>👤 {study.writer}</span>
          <span>
            게시일:{" "}
            {study.createdAt
              ? new Date(study.createdAt).toLocaleDateString()
              : "미정"}
          </span>
        </div>

        {/* 중간 정보 */}
        <div className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
          <div className="font-medium">모집 분야</div>
          <div>{study.category}</div>

          <div className="font-medium">마감일</div>
          <div>
            {study.deadline
              ? new Date(study.deadline).toLocaleDateString()
              : "미정"}
          </div>

          <div className="font-medium">예상 기간</div>
          <div>{study.duration || "미정"}</div>

          <div className="font-medium">진행 방식</div>
          <div>{study.method}</div>

          <div className="font-medium">모집 인원</div>
          <div>{study.maxPeople}명</div>
        </div>

        {/* 소개 */}
        <div>
          <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
            프로젝트 소개
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {study.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudyDetailPage;
