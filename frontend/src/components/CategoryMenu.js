import React, { useState } from 'react';
import './CategoryMenu.css';

const categories = [
  '전체','AI 개발','AI 활용(AX)','개발·프로그래밍','게임 개발',
  '데이터 사이언스','보안·네트워크','하드웨어','디자인·아트',
  '기획·경영·마케팅','모의면접 or 취준 관련','이력서'
];

const categoryIcons = {
  '전체': '/img/category/all.png',
  'AI 개발': '/img/category/AI.png',
  'AI 활용(AX)': '/img/category/AI 활용.png',
  '개발·프로그래밍': '/img/category/개발, 프로그래밍.png',
  '게임 개발': '/img/category/게임 개발.png',
  '데이터 사이언스': '/img/category/데이터 사이언스.png',
  '보안·네트워크': '/img/category/보안 네트워크.png',
  '하드웨어': '/img/category/하드웨어.png',
  '디자인·아트': '/img/category/디자인 아트.png',
  '기획·경영·마케팅': '/img/category/기획 경영 마케팅.png',
  '모의면접 or 취준 관련': '/img/category/모의면접 or 취준 관련.png',
  '이력서': '/img/category/이력서.png'
};

const CategoryMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  return (
    <div className="category-menu">
      {categories.map(cat => (
        <button
          key={cat}
          className={`category-button ${selectedCategory === cat ? 'selected' : ''}`}
          onClick={() => setSelectedCategory(cat)}
        >
          <img src={categoryIcons[cat]} alt={cat} />
          <span>{cat}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;
