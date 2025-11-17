// src/components/PostModal.js
import React, { useState } from "react";

const categories = [
  "전자",
  "전기",
  "기계",
  "컴퓨터공학",
  "생명",
  "화학",
  "교육",
  "경영",
  "경제",
  "법",
  "언어",
];

export default function PostModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("전자");

  const handleSubmit = () => {
    if (!title || !content) {
      alert("모든 내용을 입력해주세요.");
      return;
    }
    onSubmit({ title, content, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">글 작성하기</h2>

        {/* 카테고리 */}
        <label className="font-semibold">카테고리</label>
        <select
          className="w-full mt-1 border p-2 rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* 제목 */}
        <label className="font-semibold mt-4 block">제목</label>
        <input
          className="w-full border rounded-lg p-2 mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 내용 */}
        <label className="font-semibold mt-4 block">내용</label>
        <textarea
          className="w-full border rounded-lg p-2 mt-1 h-32 resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* 버튼 */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 rounded-lg bg-gray-300"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-green-600 text-white"
            onClick={handleSubmit}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}