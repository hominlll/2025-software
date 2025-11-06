import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyPage.css";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("info");
  const [editData, setEditData] = useState({ name: "", nickname: "", email: "" });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // ✅ 사용자 정보 불러오기 (처음 한 번만 실행)
  useEffect(() => {
    if (!user || !token) {
      alert("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    axios
      .post(
        "http://localhost:5000/api/user-info",
        { userId: user.userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setUserInfo(res.data);
        setEditData({
          name: res.data.name || "",
          nickname: res.data.nickname || "",
          email: res.data.email || "",
        });
      })
      .catch((err) => {
        console.error("❌ 사용자 정보 불러오기 실패:", err.response || err);
        alert("사용자 정보를 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, []); // ✅ 의존성 없음 → 최초 1회만 실행

  // ✅ 정보 수정 (버튼 클릭 시 실행)
  const handleUpdate = () => {
    if (!userInfo) return;
    axios
      .put(
        "http://localhost:5000/api/update-user",
        { ...editData, userId: userInfo.userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        alert("✅ 정보가 성공적으로 수정되었습니다!");
        // 수정 후 새 데이터 반영
        setUserInfo((prev) => ({
          ...prev,
          name: editData.name,
          nickname: editData.nickname,
          email: editData.email,
        }));
      })
      .catch((err) => {
        console.error("❌ 정보 수정 실패:", err);
        alert("정보 수정 실패");
      });
  };

  // ✅ 비밀번호 변경
  const handlePasswordChange = () => {
    axios
      .put(
        "http://localhost:5000/api/change-password",
        { ...passwordData, userId: user.userId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => alert(res.data.message))
      .catch(() => alert("비밀번호 변경 실패"));
  };

  // ✅ 회원 탈퇴
  const handleDelete = () => {
    if (!window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;

    axios
      .delete("http://localhost:5000/api/delete-user", {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: user.userId },
      })
      .then((res) => {
        alert(res.data.message);
        // ✅ 탈퇴 시에만 로그아웃 및 이동
        localStorage.clear();
        window.location.replace("/");
      })
      .catch(() => alert("회원 탈퇴 실패"));
  };

  if (loading) return <p>불러오는 중...</p>;
  if (!userInfo) return <p>사용자 정보를 불러오지 못했습니다.</p>;

  return (
    <div className="mypage-container">
      {/* ✅ 사이드바 */}
      <div className="mypage-sidebar">
        <button
          className={activeSection === "info" ? "active" : ""}
          onClick={() => setActiveSection("info")}
        >
          내 정보
        </button>
        <button
          className={activeSection === "edit" ? "active" : ""}
          onClick={() => setActiveSection("edit")}
        >
          정보 수정
        </button>
        <button
          className={activeSection === "password" ? "active" : ""}
          onClick={() => setActiveSection("password")}
        >
          비밀번호 변경
        </button>
        <button
          className={activeSection === "delete" ? "active" : ""}
          onClick={() => setActiveSection("delete")}
        >
          회원 탈퇴
        </button>
      </div>

      {/* ✅ 콘텐츠 */}
      <div className="mypage-content">
        {activeSection === "info" && (
          <section>
            <h2>내 정보</h2>
            <div className="info-item"><label>아이디</label><p>{userInfo.userId}</p></div>
            <div className="info-item"><label>이름</label><p>{userInfo.name}</p></div>
            <div className="info-item"><label>닉네임</label><p>{userInfo.nickname}</p></div>
            <div className="info-item"><label>이메일</label><p>{userInfo.email}</p></div>
            <div className="info-item"><label>가입일</label><p>{new Date(userInfo.join_date).toLocaleDateString()}</p></div>
          </section>
        )}

        {activeSection === "edit" && (
          <section>
            <h2>정보 수정</h2>
            <div className="info-item">
              <label>이름</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>
            <div className="info-item">
              <label>닉네임</label>
              <input
                type="text"
                value={editData.nickname}
                onChange={(e) => setEditData({ ...editData, nickname: e.target.value })}
              />
            </div>
            <div className="info-item">
              <label>이메일</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>
            <div className="btn-group">
              <button onClick={handleUpdate} style={{ backgroundColor: "#4caf50", color: "#fff" }}>
                저장
              </button>
            </div>
          </section>
        )}

        {activeSection === "password" && (
          <section>
            <h2>비밀번호 변경</h2>
            <div className="info-item">
              <label>현재 비밀번호</label>
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
              />
            </div>
            <div className="info-item">
              <label>새 비밀번호</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>
            <div className="btn-group">
              <button onClick={handlePasswordChange}>변경</button>
            </div>
          </section>
        )}

        {activeSection === "delete" && (
          <section>
            <h2>회원 탈퇴</h2>
            <p>정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="btn-group">
              <button className="delete-btn" onClick={handleDelete}>
                탈퇴하기
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MyPage;
