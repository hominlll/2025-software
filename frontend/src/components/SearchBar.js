import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ placeholder = "검색어를 입력하세요...", onSearch }) => {
  const [text, setText] = useState("");

  const handleSearch = () => {
    const keyword = text.trim();
    if (!keyword) return;
    if (onSearch) onSearch(keyword); // 🔹 버튼 클릭/Enter 시 검색어 전달
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        value={text}
        onChange={(e) => setText(e.target.value)} // 입력만 저장
        placeholder={placeholder}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Enter로 검색
      />
      <button className="search-button" onClick={handleSearch}>
        <img src="/img/search.svg" alt="검색" />
      </button>
    </div>
  );
};

export default SearchBar;
