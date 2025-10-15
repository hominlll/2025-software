import React, { useState } from "react";
import axios from "axios";
import "./LoginModal.css";

// ✅ onLoginSuccess 추가
const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [formType, setFormType] = useState("login");
  const [formData, setFormData] = useState({ userId: "", password: "", email: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let url = "";
      let requestData = {};

      if (formType === "login") {
        url = "http://localhost:5000/api/login";
        requestData = {
          userId: formData.userId,
          password: formData.password,
        };
      } else if (formType === "signup") {
        url = "http://localhost:5000/api/signup";
        requestData = {
          userId: formData.userId,
          password: formData.password,
          email: formData.email,
        };
      } else if (formType === "findId") {
        url = "http://localhost:5000/api/find-id";
        requestData = { email: formData.email };
      } else if (formType === "findPassword") {
        url = "http://localhost:5000/api/find-password";
        requestData = {
          userId: formData.userId,
          email: formData.email,
        };
      }

      const response = await axios.post(url, requestData);

      if (response.data.success) {
        alert(`✅ ${response.data.message}`);

        if (formType === "login") {
          // ✅ 로그인 성공 시 부모에게 알림
          if (onLoginSuccess) onLoginSuccess();
          onClose();
        } else {
          setFormType("login");
        }
      } else {
        alert(`❌ ${response.data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ 서버 오류 발생");
    }
  };

  const renderForm = () => {
    switch (formType) {
      case "login":
        return (
          <>
            <form onSubmit={handleSubmit} className="login-form">
              <input type="text" name="userId" placeholder="아이디" value={formData.userId} onChange={handleChange} required />
              <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
              <button type="submit" className="login-btn">로그인</button>
            </form>
            <div className="login-links">
              <button className="link-btn" onClick={() => setFormType("signup")}>회원가입하기</button>
              <button className="link-btn" onClick={() => setFormType("findId")}>아이디 찾기</button>
              <button className="link-btn" onClick={() => setFormType("findPassword")}>비밀번호 찾기</button>
            </div>
          </>
        );
      case "signup":
        return (
          <>
            <form onSubmit={handleSubmit} className="login-form">
              <input type="text" name="userId" placeholder="아이디" value={formData.userId} onChange={handleChange} required />
              <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
              <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleChange} required />
              <button type="submit" className="login-btn">회원가입</button>
            </form>
            <button className="link-btn" onClick={() => setFormType("login")}>로그인 화면으로 돌아가기</button>
          </>
        );
      case "findId":
        return (
          <>
            <form onSubmit={handleSubmit} className="login-form">
              <input type="email" name="email" placeholder="가입한 이메일 입력" value={formData.email} onChange={handleChange} required />
              <button type="submit" className="login-btn">아이디 찾기</button>
            </form>
            <button className="link-btn" onClick={() => setFormType("login")}>로그인 화면으로 돌아가기</button>
          </>
        );
      case "findPassword":
        return (
          <>
            <form onSubmit={handleSubmit} className="login-form">
              <input type="text" name="userId" placeholder="아이디 입력" value={formData.userId} onChange={handleChange} required />
              <input type="email" name="email" placeholder="가입한 이메일 입력" value={formData.email} onChange={handleChange} required />
              <button type="submit" className="login-btn">비밀번호 찾기</button>
            </form>
            <button className="link-btn" onClick={() => setFormType("login")}>로그인 화면으로 돌아가기</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <img src="/img/logo.png" alt="로고" className="modal-logo" />
        {renderForm()}
      </div>
    </div>
  );
};

export default LoginModal;
