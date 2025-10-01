import React from 'react';

const Header = () => {
  return (
    <header style={{display:'flex', justifyContent:'space-between', padding:'10px 50px', alignItems:'center', borderBottom:'1px solid #ccc'}}>
      <h1 style={{color:'#27ae60'}}>Inflearn</h1>
      <nav>
        <button>강의</button>
        <button>챌린지</button>
        <button>멘토링</button>
        <button>로드맵</button>
        <button>지식공유</button>
        <button>로그인</button>
      </nav>
    </header>
  );
};

export default Header;
