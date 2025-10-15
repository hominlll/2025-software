import React, { useState } from "react";
import "./LoginModal.css";

const LoginModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("로그인 시도:", formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* ✅ 맨 위 로고 이미지 (public/img/logo.png) */}
        <img src="/img/logo.png" alt="로고" className="modal-logo" />

        {/* 로그인 입력창 */}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="userId"
            placeholder="아이디"
            value={formData.userId}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-btn">
            로그인
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="login-links">
          <button className="link-btn">회원가입하기</button>
          <button className="link-btn">아이디 찾기</button>
          <button className="link-btn">비밀번호 찾기</button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
