import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyPage.css";

const MyPage = () => {
  const [view, setView] = useState("info");
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [notifications, setNotifications] = useState({ email: true, sms: false });

  // 사용자 정보 불러오기
  useEffect(() => {
    axios.get("http://localhost:5000/api/user/info", { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setUserInfo(res.data.user);
          setFormData(res.data.user);
          setNotifications(res.data.user.notifications || { email: true, sms: false });
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        console.error("사용자 정보 불러오기 실패:", err);
        alert("사용자 정보를 불러오지 못했습니다.");
      });
  }, []);

  // 정보 수정 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 비밀번호 변경 핸들러
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // 알림 설정 핸들러
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  // 프로필 이미지 업로드 핸들러
  const handleProfileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  // 정보 저장
  const handleSave = () => {
    axios.post("http://localhost:5000/api/user/update", formData, { withCredentials: true })
      .then(() => {
        alert("정보 수정 완료!");
        setUserInfo(formData);
        setIsEditing(false);
      })
      .catch(err => alert("수정 실패: " + err.message));
  };

  // 비밀번호 저장
  const handlePasswordSave = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("새 비밀번호와 확인이 일치하지 않습니다.");
      return;
    }
    axios.post("http://localhost:5000/api/user/change-password", passwordData, { withCredentials: true })
      .then(() => {
        alert("비밀번호 변경 완료!");
        setPasswordData({ current: "", new: "", confirm: "" });
      })
      .catch(err => alert("비밀번호 변경 실패: " + err.message));
  };

  // 프로필 업로드
  const handleProfileUpload = () => {
    if (!profileImage) return alert("이미지를 선택해주세요.");
    const form = new FormData();
    form.append("profile", profileImage);

    axios.post("http://localhost:5000/api/user/upload-profile", form, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" }
    })
      .then(() => alert("프로필 업로드 완료!"))
      .catch(err => alert("업로드 실패: " + err.message));
  };

  // 알림 저장
  const handleNotificationSave = () => {
    axios.post("http://localhost:5000/api/user/notifications", notifications, { withCredentials: true })
      .then(() => alert("알림 설정 저장 완료!"))
      .catch(err => alert("저장 실패: " + err.message));
  };

  // 회원 탈퇴
  const handleDeleteAccount = () => {
    if (!window.confirm("정말 계정을 삭제하시겠습니까?")) return;
    axios.post("http://localhost:5000/api/user/delete", {}, { withCredentials: true })
      .then(() => {
        alert("계정이 삭제되었습니다.");
        window.location.href = "/";
      })
      .catch(err => alert("계정 삭제 실패: " + err.message));
  };

  if (!userInfo) return <div className="mypage-loading">로딩 중...</div>;

  return (
    <div className="mypage-container">
      <aside className="mypage-sidebar">
        <button onClick={() => setView("info")} className={view==="info"?"active":""}>내 정보</button>
        <button onClick={() => setView("password")} className={view==="password"?"active":""}>비밀번호 변경</button>
        <button onClick={() => setView("profile")} className={view==="profile"?"active":""}>프로필 사진</button>
        <button onClick={() => setView("notifications")} className={view==="notifications"?"active":""}>알림 설정</button>
        <button onClick={() => setView("delete")} className={view==="delete"?"active":""}>회원 탈퇴</button>
      </aside>

      <section className="mypage-content">
        {view === "info" && (
          <div>
            <h2>내 정보</h2>
            <div className="info-item">
              <label>아이디</label>
              <span>{userInfo.userId}</span>
            </div>
            <div className="info-item">
              <label>이름</label>
              {isEditing ? <input name="name" value={formData.name} onChange={handleChange}/> : <span>{userInfo.name}</span>}
            </div>
            <div className="info-item">
              <label>이메일</label>
              {isEditing ? <input name="email" value={formData.email} onChange={handleChange}/> : <span>{userInfo.email}</span>}
            </div>
            <div className="info-item">
              <label>닉네임</label>
              {isEditing ? <input name="nickname" value={formData.nickname} onChange={handleChange}/> : <span>{userInfo.nickname}</span>}
            </div>
            <div className="btn-group">
              {isEditing ? (
                <>
                  <button onClick={handleSave}>저장</button>
                  <button onClick={() => { setFormData(userInfo); setIsEditing(false); }}>취소</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)}>수정하기</button>
              )}
            </div>
          </div>
        )}

        {view === "password" && (
          <div>
            <h2>비밀번호 변경</h2>
            <div className="info-item">
              <label>현재 비밀번호</label>
              <input type="password" name="current" value={passwordData.current} onChange={handlePasswordChange}/>
            </div>
            <div className="info-item">
              <label>새 비밀번호</label>
              <input type="password" name="new" value={passwordData.new} onChange={handlePasswordChange}/>
            </div>
            <div className="info-item">
              <label>새 비밀번호 확인</label>
              <input type="password" name="confirm" value={passwordData.confirm} onChange={handlePasswordChange}/>
            </div>
            <button onClick={handlePasswordSave}>비밀번호 변경</button>
          </div>
        )}

        {view === "profile" && (
          <div>
            <h2>프로필 사진</h2>
            <input type="file" accept="image/*" onChange={handleProfileChange}/>
            <button onClick={handleProfileUpload}>업로드</button>
          </div>
        )}

        {view === "notifications" && (
          <div>
            <h2>알림 설정</h2>
            <label>
              <input type="checkbox" name="email" checked={notifications.email} onChange={handleNotificationChange}/>
              이메일 알림
            </label>
            <label>
              <input type="checkbox" name="sms" checked={notifications.sms} onChange={handleNotificationChange}/>
              문자 알림
            </label>
            <button onClick={handleNotificationSave}>저장</button>
          </div>
        )}

        {view === "delete" && (
          <div>
            <h2>회원 탈퇴</h2>
            <p>계정을 삭제하면 모든 데이터가 삭제됩니다. 신중히 선택해주세요.</p>
            <button className="delete-btn" onClick={handleDeleteAccount}>계정 삭제</button>
          </div>
        )}
      </section>
    </div>
  );
};

export default MyPage;
