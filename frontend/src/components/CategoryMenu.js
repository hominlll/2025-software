import React, { useState } from 'react';
import './CategoryMenu.css';

const categories = [
  '전체','경영','경제','교육','법',
  '디자인','기계','전기·전자','컴퓨터공학',
  '화학','생명','면접'
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
  '컴퓨터공학': '/img/category/컴퓨터공학.png',
  '화학': '/img/category/화학.png',
  '면접': '/img/category/면접.png'
};

const CategoryMenu = ({ setSelectedCategory }) => {
  const [activeCategory, setActiveCategory] = useState('전체');

  const handleClick = (cat) => {
    setActiveCategory(cat);
    setSelectedCategory(cat === '전체' ? null : cat); 
  };

  return (
    <div className="category-menu">
      {categories.map(cat => (
        <button
          key={cat}
          className={`category-button ${activeCategory === cat ? 'selected' : ''}`}
          onClick={() => handleClick(cat)}
        >
          <img src={categoryIcons[cat]} alt={cat} />
          <span>{cat}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryMenu;
