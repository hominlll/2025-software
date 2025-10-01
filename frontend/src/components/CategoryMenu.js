import React from 'react';

const categories = ['전체','AI 개발','AI 활용(AX)','개발·프로그래밍','게임 개발','데이터 사이언스','보안·네트워크','하드웨어','디자인·아트','기획·경영·마케팅','업무 생산성','커리어·자기계발','대학 교육'];

const CategoryMenu = () => {
  return (
    <div style={{display:'flex', padding:'10px 50px', gap:'15px'}}>
      {categories.map(cat => <button key={cat}>{cat}</button>)}
    </div>
  );
};

export default CategoryMenu;
