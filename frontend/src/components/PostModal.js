// src/components/PostModal.js
import React, { useState } from "react";

const categories = [
  "경영",
  "경제",
  "교육",
  "법",
  "디자인",
  "기계",
  "전기·전자",
  "컴퓨터공학",
  "화학",
  "생명",
  "면접",
];

export default function PostModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert("카테고리, 제목, 내용을 모두 입력해주세요.");
      return;
    }
    const newPost = {
      title: title.trim(),
      content: content.trim(),
      category,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-start justify-between border-b px-7 pt-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">글 작성하기</h2>
            <p className="mt-1 text-xs text-gray-500">
              질문, 정보, 경험을 커뮤니티와 함께 나눠보세요.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 shadow-sm transition hover:bg-emerald-200"
            aria-label="닫기"
          >
            <span className="text-lg leading-none">&times;</span>
          </button>
        </div>

        {/* 내용 */}
        <div className="px-7 pt-5 pb-6 space-y-4">
          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              카테고리
            </label>
            <select
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              제목
            </label>
            <input
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              placeholder="예) 컴퓨터공학 취업 준비 어떻게 시작해야 할까요?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800">
              내용
            </label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 h-40 resize-none"
              placeholder="상황이나 고민, 공유하고 싶은 정보를 자세히 적어주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* 버튼 영역 */}
          <div className="mt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm transition hover:bg-gray-50"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="button"
              className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600 hover:shadow-lg active:translate-y-[1px]"
              onClick={handleSubmit}
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
