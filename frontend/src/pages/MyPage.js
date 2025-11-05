import React, { useEffect, useState } from "react";
import axios from "axios";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token) {
      alert("로그인이 필요합니다.");
      setLoading(false);
      return;
    }
    axios
      .post(
        "http://localhost:5000/api/user-info",
        { userId: user.userId },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ 토큰 전송
      )
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => {
        console.error("❌ 사용자 정보 불러오기 실패:", err.response || err);
        alert("사용자 정보를 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, []);


  if (loading) return <p>불러오는 중...</p>;
  if (!userInfo) return <p>사용자 정보를 불러오지 못했습니다.</p>;

  return (
    <div>
      <h2>마이페이지</h2>
      <p>아이디: {userInfo.userId}</p>
      <p>이름: {userInfo.name || "미등록"}</p>
      <p>닉네임: {userInfo.nickname || "미등록"}</p>
      <p>이메일: {userInfo.email}</p>
      <p>가입일: {new Date(userInfo.join_date).toLocaleDateString()}</p>
    </div>
  );
};

export default MyPage;
