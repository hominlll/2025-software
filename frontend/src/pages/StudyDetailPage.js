import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StudyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [study, setStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  // 조회수 증가 함수
  const increaseViews = async () => {
    try {
      await axios.post(`http://localhost:5000/api/studies/${id}/views`);
    } catch (err) {
      console.error("조회수 증가 오류:", err);
    }
  };

  // 페이지 로드 시 데이터 불러오기
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCurrentUser = async () => {
      if (!token) return;
      try {
        const res = await axios.post(
          "http://localhost:5000/api/user-info",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) setCurrentUser(res.data.user);
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

    const fetchParticipants = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/study/${id}/participants`
        );
        if (res.data.success) setParticipants(res.data.participants);
        else setParticipants([]);
      } catch (err) {
        console.error("참여자 조회 오류:", err);
        setParticipants([]);
      }
    };

    fetchCurrentUser();
    fetchStudy();
    fetchParticipants();
    increaseViews(); // <-- 조회수 증가 실행!
  }, [id]);

  // 참여 여부 체크
  useEffect(() => {
    if (currentUser) {
      const joined = participants.some(
        (p) => p.userId === currentUser.userId
      );
      setIsJoined(joined);
    }
  }, [currentUser, participants]);

  // 참여하기
  const handleJoin = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/study/join",
        { studyId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setParticipants((prev) => [
          ...prev,
          { userId: currentUser.userId, nickname: currentUser.nickname },
        ]);
        setIsJoined(true);
        alert("스터디에 참여했습니다.");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("참여 오류:", err);
      alert("참여 중 오류가 발생했습니다.");
    }
  };

  // 참여 취소
  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/study/cancel",
        { studyId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setParticipants((prev) =>
          prev.filter((p) => p.userId !== currentUser.userId)
        );
        setIsJoined(false);
        alert("참여를 취소했습니다.");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("취소 오류:", err);
      alert("취소 중 오류가 발생했습니다.");
    }
  };

  // 스터디 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:5000/api/studies/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        alert("스터디가 삭제되었습니다.");
        navigate(-1);
      }
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p className="text-center py-10">로딩 중...</p>;
  if (!study) return <p className="text-center py-10">스터디를 찾을 수 없습니다.</p>;

  return (
    <div className="w-[70%] mx-auto py-8">
      {/* 뒤로가기 + 삭제 버튼 */}
      <div className="flex items-center justify-between mb-5">
        <button
          className="px-4 py-2 bg-green-500 rounded hover:bg-green-300"
          onClick={() => navigate(-1)}
        >
          ← 뒤로가기
        </button>

        {currentUser &&
          study.writer &&
          currentUser.nickname.trim() === study.writer.trim() && (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-300"
              onClick={handleDelete}
            >
              스터디 삭제
            </button>
          )}
      </div>

      {/* 기본 정보 카드 */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h1 className="text-2xl font-bold mb-3">{study.studyName}</h1>

        <div className="flex flex-wrap items-center space-x-6 text-gray-600 text-sm mb-6 border-b border-gray-300 pb-1">
          <span>👤 {study.writer}</span>
          <span>
            게시일: {study.createdAt ? new Date(study.createdAt).toLocaleDateString() : "미정"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
          <div className="font-medium">모집 분야</div>
          <div>{study.category}</div>

          <div className="font-medium">마감일</div>
          <div>{study.deadline ? new Date(study.deadline).toLocaleDateString() : "미정"}</div>

          <div className="font-medium">예상 기간</div>
          <div>{study.duration || "미정"}</div>

          <div className="font-medium">진행 방식</div>
          <div>{study.method}</div>

          <div className="font-medium">모집 인원</div>
          <div>{study.maxPeople}명</div>
        </div>

        <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
          스터디 소개
        </h2>
        <p className="text-gray-700 whitespace-pre-line">{study.description}</p>
      </div>

      {/* 참여자 카드 */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        {currentUser &&
          study.writer &&
          currentUser.nickname.trim() !== study.writer.trim() && (
            <div className="mb-4">
              {!isJoined ? (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-300"
                  onClick={handleJoin}
                >
                  참여하기
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-300"
                  onClick={handleCancel}
                >
                  참여 취소
                </button>
              )}
            </div>
          )}

        <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
          참여자 ({participants.length})
        </h2>
        <ul className="list-disc list-inside text-gray-700">
          {participants.map((p) => (
            <li key={p.userId}>{p.nickname || p.userId}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudyDetailPage;
