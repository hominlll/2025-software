import React, { useState } from 'react';
import './SearchBar.css'; // 스타일 분리

const SearchBar = ({ placeholder = "검색어를 입력하세요..." }) => {
  const [text, setText] = useState("");

  const handleSearch = () => {
    if (!text.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }
    alert(`검색: ${text}`);
    // 실제 검색 API 호출 로직 추가 가능
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
      />
      <button className="search-button" onClick={handleSearch}>
        <img src="/img/search.svg" alt="검색" />
      </button>
    </div>
  );
};

export default SearchBar;
