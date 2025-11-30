import React, { useState } from "react";

const categories = [
  '전체', '경영', '경제', '교육', '법',
  '디자인', '기계', '전기·전자', '컴퓨터공학',
  '화학', '생명', '면접'
];

export default function StudyCreateModal({ onClose, onSubmit, userNickname }) {
  const [studyName, setStudyName] = useState("");   // ⭐ 추가
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState("");
  const [method, setMethod] = useState("");
  const [duration, setDuration] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!studyName || !category || !deadline || !method || !duration || !maxPeople || !description) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    const newStudy = {
      id: Date.now(),
      studyName,
      writer: userNickname,
      category,
      deadline,
      method,
      duration,
      maxPeople,
      description,
      date: new Date(),
    };

    onSubmit(newStudy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[500px] rounded-2xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">스터디 모집글 작성</h2>
        </div>

        <div className="flex flex-col gap-4">

          {/* ⭐ 스터디명 추가 */}
          <div>
            <label className="text-sm font-medium text-gray-700">스터디명</label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              placeholder="예: 자바스크립트 심화 스터디"
              value={studyName}
              onChange={(e) => setStudyName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">작성자</label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
              value={userNickname || ""}
              readOnly
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">모집 분야</label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">선택해주세요</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">마감일</label>
            <input
              type="date"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">진행 방식</label>
            <select
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="">선택해주세요</option>
              <option value="온라인">온라인</option>
              <option value="오프라인">오프라인</option>
              <option value="혼합">혼합</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">예상 기간</label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              placeholder="예: 4주, 2개월"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">모집 인원</label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              placeholder="예: 5"
              min={1}
              value={maxPeople}
              onChange={(e) => setMaxPeople(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">스터디 소개</label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none resize-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              placeholder="스터디에 대한 자세한 소개를 작성해주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm bg-gray-400 text-white hover:bg-red-500 transition-colors duration-300"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 hover:shadow-md"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}
