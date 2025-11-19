import React, { useState } from 'react';
import './CategoryMenu.css';

const categories = [
  '전체','경영','경제','교육','기계',
  '디자인','법','생명','전기·전자',
  '컴공','화학','면접'
];

const categoryIcons = {
  '전체': '/img/category/all.png',
  '경영': '/img/category/경영.png',
  '경제': '/img/category/경제.png',
  '교육': '/img/category/교육.png',
  '기계': '/img/category/기계.png',
  '디자인': '/img/category/디자인.png',
  '법': '/img/category/법.png',
  '생명': '/img/category/생명.png',
  '전기·전자': '/img/category/전기·전자.png',
  '컴공': '/img/category/컴공.png',
  '화학': '/img/category/화학.png',
  '면접': '/img/category/면접.png'
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
