// src/components/CategoryBar.js
import React from "react";

const categories = [
  "전체",
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

export default function CategoryBar({ selected, setSelected }) {
  return (
    <div className="flex flex-col gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => setSelected(cat)}
          className={`community-category-btn w-full text-left px-3 py-1.5
                      text-sm rounded-md border transition 
            ${
              selected === cat
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
