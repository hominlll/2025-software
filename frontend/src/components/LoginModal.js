import React, { useState } from "react";
import axios from "axios";
import "./LoginModal.css";

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [formType, setFormType] = useState("login"); // login | signup | findId | findPassword
  const [formData, setFormData] = useState({ userId: "", password: "", email: "" });
  const [resultMessage, setResultMessage] = useState(""); // 서버 응답 메시지 표시용

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResultMessage(""); // 제출 시 결과 초기화

    try {
      let url = "";
      let requestData = {};

      if (formType === "login") {
        url = "http://localhost:5000/login";
        requestData = { userId: formData.userId, password: formData.password };
      } else if (formType === "signup") {
        url = "http://localhost:5000/signup";
        requestData = { userId: formData.userId, password: formData.password, email: formData.email };
      } else if (formType === "findId") {
        url = "http://localhost:5000/find-id";
        requestData = { email: formData.email };
      } else if (formType === "findPassword") {
        url = "http://localhost:5000/find-password";
        requestData = { userId: formData.userId, email: formData.email };
      }

      const response = await axios.post(url, requestData);
      const data = response.data;

      if (data.success) {
        if (formType === "login") {
          setResultMessage("✅ 로그인 성공!");
          if (onLoginSuccess) onLoginSuccess();
          setTimeout(() => onClose(), 1200);
        } else if (formType === "signup") {
          setResultMessage("✅ 회원가입 완료! 로그인 해주세요.");
          setFormType("login");
        } else if (formType === "findId") {
          setResultMessage(`🔍 아이디: ${data.userId}`);
        } else if (formType === "findPassword") {
          setResultMessage(`🔐 비밀번호: ${data.password}`);
        }
      } else {
        setResultMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setResultMessage("⚠️ 서버 오류가 발생했습니다.");
    }
  };

  const switchForm = (type) => {
    setFormType(type);
    setResultMessage(""); // 폼 전환 시 메시지 초기화
    setFormData({ userId: "", password: "", email: "" }); // 입력값 초기화
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
              <button className="link-btn" onClick={() => switchForm("signup")}>회원가입</button>
              <button className="link-btn" onClick={() => switchForm("findId")}>아이디 찾기</button>
              <button className="link-btn" onClick={() => switchForm("findPassword")}>비밀번호 찾기</button>
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
            <button className="link-btn" onClick={() => switchForm("login")}>로그인 화면으로</button>
          </>
        );

      case "findId":
        return (
          <>
            <form onSubmit={handleSubmit} className="login-form">
              <input type="email" name="email" placeholder="가입한 이메일 입력" value={formData.email} onChange={handleChange} required />
              <button type="submit" className="login-btn">아이디 찾기</button>
            </form>
            <button className="link-btn" onClick={() => switchForm("login")}>로그인 화면으로</button>
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
            <button className="link-btn" onClick={() => switchForm("login")}>로그인 화면으로</button>
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
        {/* 메시지를 로고 밑, 폼 위에 표시 */}
        <p
          className={`result-message ${resultMessage.includes("✅") ? "success" : resultMessage.includes("❌") || resultMessage.includes("⚠️") ? "error" : ""}`}
        >
          {resultMessage}
        </p>
        {renderForm()}
      </div>
    </div>
  );
};

export default LoginModal;
