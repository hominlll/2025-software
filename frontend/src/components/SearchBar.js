import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ placeholder = "검색어를 입력하세요...", onSearch }) => {
  const [text, setText] = useState("");

  const handleSearch = () => {
    const keyword = text.trim();
    onSearch(keyword); // 🔥 태그 검색 해제는 부모에서 처리
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button className="search-button" onClick={handleSearch}>
        <img src="/img/search.svg" alt="검색" />
      </button>
    </div>
  );
};

export default SearchBar;
