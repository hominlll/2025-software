import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyPage = ({ userNickname, setUserNickname, currentUserId }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("info");
  const [editData, setEditData] = useState({ name: "", nickname: "", email: "" });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" });
  const [myStudies, setMyStudies] = useState([]);
  const [joinedStudies, setJoinedStudies] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    axios.post("http://localhost:5000/api/user-info", {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.success) {
          const u = res.data.user;
          setUserInfo(u);
          setEditData({ name: u.name || "", nickname: u.nickname || "", email: u.email || "" });
        } else {
          alert("사용자 정보를 불러오지 못했습니다.");
        }
      })
      .catch(() => alert("사용자 정보를 불러오지 못했습니다."));

    axios.get("http://localhost:5000/api/user-studies", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.success) {
          setMyStudies(res.data.myStudies || []);
          setJoinedStudies(res.data.joinedStudies || []);
        }
      })
      .catch(() => { setMyStudies([]); setJoinedStudies([]); })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = () => {
    if (!userInfo) return;
    axios.put("http://localhost:5000/api/update-user", { ...editData, userId: userInfo.userId }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.success) {
          alert("정보가 성공적으로 수정되었습니다!");
          setUserInfo(prev => ({ ...prev, ...editData }));
          if (userInfo.userId === currentUserId) setUserNickname(editData.nickname);
        } else {
          alert("정보 수정 실패");
        }
      })
      .catch(() => alert("정보 수정 실패"));
  };

  const handlePasswordChange = () => {
    axios.put("http://localhost:5000/api/change-password", { ...passwordData, userId: userInfo.userId }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => alert(res.data.message))
      .catch(() => alert("비밀번호 변경 실패"));
  };

  const handleDelete = () => {
    if (!window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
    axios.delete("http://localhost:5000/api/delete-user", { headers: { Authorization: `Bearer ${token}` }, data: { userId: userInfo.userId } })
      .then(res => {
        alert(res.data.message);
        localStorage.clear();
        window.location.replace("/");
      })
      .catch(() => alert("회원 탈퇴 실패"));
  };

  const handleDeleteStudy = (studyId) => {
    if (!window.confirm("이 스터디를 삭제하시겠습니까?")) return;
    axios.delete(`http://localhost:5000/api/studies/${studyId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.success) {
          alert("스터디가 삭제되었습니다.");
          setMyStudies(prev => prev.filter(s => s.id !== studyId));
        } else {
          alert("삭제 실패");
        }
      })
      .catch(() => alert("삭제 실패"));
  };

  const handleCancelParticipation = (studyId) => {
    if (!window.confirm("참여를 취소하시겠습니까?")) return;
    axios.post("http://localhost:5000/api/study/cancel", { studyId }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.success) {
          alert("참여가 취소되었습니다.");
          setJoinedStudies(prev => prev.filter(s => s.id !== studyId));
        } else {
          alert("참여 취소 실패");
        }
      })
      .catch(() => alert("참여 취소 실패"));
  };

  if (loading) return <p className="text-center mt-20">불러오는 중...</p>;
  if (!userInfo) return <p className="text-center mt-20">사용자 정보를 불러오지 못했습니다.</p>;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-sans bg-gray-100 text-gray-800">
      {/* 사이드바 */}
      <div className="w-full lg:w-72 bg-white flex flex-col justify-between p-4 border-r border-gray-200 shadow-sm">
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">
            ← 뒤로가기
          </button>

          {["info", "edit", "password", "studies"].map(section => {
            const labels = { info: "내 정보", edit: "정보 수정", password: "비밀번호 변경", studies: "스터디 관리" };
            return (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${activeSection === section ? "bg-green-100 border-2 border-green-500 text-green-700 shadow-md" : "bg-white border border-gray-300 text-gray-800 hover:bg-green-50 hover:border-green-400 hover:text-green-600"}`}
              >
                {labels[section]}
              </button>
            );
          })}

          <button onClick={() => setActiveSection("delete")} className="px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors mt-2">
            회원 탈퇴
          </button>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="flex-1 lg:w-3/5 p-8">
        <div className="flex flex-col gap-6">
          {activeSection === "info" && (
            <SectionCard title="내 정보">
              <InfoRow label="아이디" value={userInfo.userId} />
              <InfoRow label="이름" value={userInfo.name} />
              <InfoRow label="닉네임" value={userInfo.nickname} />
              <InfoRow label="이메일" value={userInfo.email} />
              <InfoRow label="가입일" value={new Date(userInfo.join_date).toLocaleDateString()} />
            </SectionCard>
          )}

          {activeSection === "edit" && (
            <SectionCard title="정보 수정">
              <EditRow label="이름" value={editData.name} onChange={v => setEditData({ ...editData, name: v })} />
              <EditRow label="닉네임" value={editData.nickname} onChange={v => setEditData({ ...editData, nickname: v })} />
              <EditRow label="이메일" value={editData.email} onChange={v => setEditData({ ...editData, email: v })} />
              <button onClick={handleUpdate} className="mt-4 px-5 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600">저장</button>
            </SectionCard>
          )}

          {activeSection === "password" && (
            <SectionCard title="비밀번호 변경">
              <EditRow label="현재 비밀번호" value={passwordData.oldPassword} onChange={v => setPasswordData({ ...passwordData, oldPassword: v })} type="password" />
              <EditRow label="새 비밀번호" value={passwordData.newPassword} onChange={v => setPasswordData({ ...passwordData, newPassword: v })} type="password" />
              <button onClick={handlePasswordChange} className="mt-4 px-5 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600">변경</button>
            </SectionCard>
          )}

          {activeSection === "studies" && (
            <SectionCard title="내 스터디 관리">
              <p className="text-lg font-semibold mb-2">내가 만든 스터디</p>
              {myStudies.length === 0 && <p>등록된 스터디가 없습니다.</p>}
              {myStudies.map(s => (
                <div key={s.id} className="flex justify-between items-center p-4 border rounded-lg mb-3">
                  <div>
                    <p className="font-semibold">{s.studyName}</p>
                    <p className="text-sm text-gray-500">참여: {s.participantCount} / {s.maxPeople}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/study/${s.id}`)} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">상세보기</button>
                    <button onClick={() => handleDeleteStudy(s.id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm">삭제</button>
                  </div>
                </div>
              ))}

              <p className="text-lg font-semibold mb-2 mt-6">참여중인 스터디</p>
              {joinedStudies.length === 0 && <p>참여중인 스터디가 없습니다.</p>}
              {joinedStudies.map(s => (
                <div key={s.id} className="flex justify-between items-center p-4 border rounded-lg mb-3">
                  <div>
                    <p className="font-semibold">{s.studyName}</p>
                    <p className="text-sm text-gray-500">참여: {s.participantCount} / {s.maxPeople}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/study/${s.id}`)} className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">상세보기</button>
                    <button onClick={() => handleCancelParticipation(s.id)} className="px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-sm">참여 취소</button>
                  </div>
                </div>
              ))}
            </SectionCard>
          )}

          {activeSection === "delete" && (
            <SectionCard title="회원 탈퇴">
              <p className="mb-4">정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
              <button onClick={handleDelete} className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600">탈퇴하기</button>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h2 className="text-2xl font-bold border-b pb-3 mb-6">{title}</h2>
    {children}
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="mb-4">
    <label className="block font-semibold mb-1">{label}</label>
    <p className="bg-gray-50 p-2 rounded-md border border-gray-200">{value}</p>
  </div>
);

const EditRow = ({ label, value, onChange, type = "text" }) => (
  <div className="mb-4">
    <label className="block font-semibold mb-1">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300" />
  </div>
);

export default MyPage;
