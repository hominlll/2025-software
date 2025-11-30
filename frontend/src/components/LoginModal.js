import React, { useState } from "react";
import axios from "axios";
import "./LoginModal.css";

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [formType, setFormType] = useState("login");
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    email: "",
    name: "",
    nickname: "",
  });
  const [resultMessage, setResultMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResultMessage("");

    try {
      const apiMap = {
        login: { url: "/api/login", data: { userId: formData.userId, password: formData.password } },
        signup: {
          url: "/api/signup",
          data: {
            userId: formData.userId,
            password: formData.password,
            email: formData.email,
            name: formData.name,
            nickname: formData.nickname,
          },
        },
        findId: { url: "/api/find-id", data: { email: formData.email } },
        findPassword: { url: "/api/find-password", data: { userId: formData.userId, email: formData.email } },
      };

      const { url, data } = apiMap[formType];
      const res = await axios.post(`http://localhost:5000${url}`, data);
      const result = res.data;

      if (!result.success) return setResultMessage(`❌ ${result.message}`);

      switch (formType) {
        case "login":
          localStorage.setItem("user", JSON.stringify(result.user));
          localStorage.setItem("token", result.token);

          setResultMessage("✅ 로그인 성공!");
          if (onLoginSuccess) onLoginSuccess(result.user.nickname); // ⭐ 닉네임 전달
          setTimeout(() => onClose(), 800);
          break;

        case "signup":
          setResultMessage("✅ 회원가입 완료! 로그인 해주세요.");
          setFormType("login");
          break;

        case "findId":
          setResultMessage(`🔍 아이디는 '${result.userId}' 입니다.`);
          break;

        case "findPassword":
          setResultMessage(`🔐 비밀번호는 '${result.password}' 입니다.`);
          break;

        default:
          break;
      }
    } catch (err) {
      console.error(err);
      setResultMessage("⚠️ 서버 오류가 발생했습니다.");
    }
  };

  const switchForm = (type) => {
    setFormType(type);
    setResultMessage("");
    setFormData({
      userId: "",
      password: "",
      email: "",
      name: "",
      nickname: "",
    });
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
            <form onSubmit={handleSubmit} className="login-form signup-form">
              <input type="text" name="userId" placeholder="아이디" value={formData.userId} onChange={handleChange} required />
              <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
              <input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required />
              <input type="text" name="nickname" placeholder="닉네임" value={formData.nickname} onChange={handleChange} required />
              <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleChange} required />
              <button type="submit" className="login-btn">회원가입</button>
            </form>
            <button className="link-btn" onClick={() => switchForm("login")}>로그인 화면으로 돌아가기</button>
          </>
        );
      case "findId":
        return (
          <>
            <form onSubmit={handleSubmit} className="login-form">
              <input type="email" name="email" placeholder="가입한 이메일 입력" value={formData.email} onChange={handleChange} required />
              <button type="submit" className="login-btn">아이디 찾기</button>
            </form>
            <button className="link-btn" onClick={() => switchForm("login")}>로그인 화면으로 돌아가기</button>
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
            <button className="link-btn" onClick={() => switchForm("login")}>로그인 화면으로 돌아가기</button>
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
        {resultMessage && (
          <p className={`result-message ${resultMessage.includes("✅") ? "success" :
              resultMessage.includes("❌") || resultMessage.includes("⚠️") ? "error" : ""
            }`}>
            {resultMessage}
          </p>
        )}
        {renderForm()}
      </div>
    </div>
  );
};

export default LoginModal;
