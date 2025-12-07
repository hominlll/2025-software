import React, { useState, useEffect } from "react";
import axios from "axios";

const categories = [
  '전체', '경영', '경제', '교육', '법',
  '디자인', '기계', '전기·전자', '컴퓨터공학',
  '화학', '생명', '면접'
];

export default function StudyCreateModal({ onClose }) {
  const [studyName, setStudyName] = useState("");
  const [writer, setWriter] = useState(""); // 작성자 상태
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState("");
  const [method, setMethod] = useState("");
  const [duration, setDuration] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [description, setDescription] = useState("");

  // 로그인 유저 정보 가져오기 (디테일페이지처럼 최신화)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.post(
          "http://localhost:5000/api/user-info",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setWriter(res.data.user.nickname || "");
        }
      } catch (err) {
        console.error("유저 정보 불러오기 오류:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleSubmit = async () => {
    if (!studyName || !category || !deadline || !method || !duration || !maxPeople || !description) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const newStudy = {
      studyName,
      writer,
      category,
      deadline,
      method,
      duration,
      maxPeople: Number(maxPeople),
      description
    };

    try {
      const res = await axios.post("http://localhost:5000/api/studies", newStudy);
      if (res.data.success) {
        alert("스터디 등록 성공!");
        onClose(true); // 상위 컴포넌트에서 새로고침 없이 카드 반영
      } else {
        alert("스터디 등록 실패: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("스터디 등록 실패: 서버 오류");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[500px] rounded-2xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">스터디 모집글 작성</h2>
        </div>

        <div className="flex flex-col gap-4">
          {/* 스터디명 */}
          <div>
            <label className="text-sm font-medium text-gray-700">스터디명</label>
            <input
              type="text"
              value={studyName}
              onChange={(e) => setStudyName(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none
                focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              placeholder="예: 자바스크립트 심화 스터디"
            />
          </div>

          {/* 작성자 */}
          <div>
            <label className="text-sm font-medium text-gray-700">작성자</label>
            <input
              type="text"
              value={writer}
              readOnly
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* 모집 분야 */}
          <div>
            <label className="text-sm font-medium text-gray-700">모집 분야</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none
                focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            >
              <option value="">선택해주세요</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* 마감일 */}
          <div>
            <label className="text-sm font-medium text-gray-700">모집 마감일</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none
                focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>

          {/* 진행 방식 */}
          <div>
            <label className="text-sm font-medium text-gray-700">진행 방식</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none
                focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            >
              <option value="">선택해주세요</option>
              <option value="온라인">온라인</option>
              <option value="오프라인">오프라인</option>
              <option value="혼합">혼합</option>
            </select>
          </div>

          {/* 예상 기간 */}
          <div>
            <label className="text-sm font-medium text-gray-700">활동 예상 기간</label>
            <input
              type="text"
              placeholder="예: 4주, 2개월"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none
                focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>

          {/* 모집 인원 */}
          <div>
            <label className="text-sm font-medium text-gray-700">모집 인원</label>
            <input
              type="number"
              placeholder="예: 5"
              min={1}
              value={maxPeople}
              onChange={(e) => setMaxPeople(Math.max(1, Number(e.target.value)))}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none
                focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>

          {/* 스터디 소개 */}
          <div>
            <label className="text-sm font-medium text-gray-700">스터디 소개</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none resize-none
                focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              placeholder="스터디에 대한 자세한 소개를 작성해주세요."
            />
          </div>
        </div>

        {/* 버튼들 */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm
              bg-gray-400 text-white hover:bg-red-500 transition-colors duration-300"
          >
            취소
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm
              hover:bg-green-600 hover:shadow-md"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}
