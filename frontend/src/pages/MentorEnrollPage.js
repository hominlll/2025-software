// src/pages/MentorEnrollPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function MentorEnrollPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [mentor, setMentor] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState(null);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");
    const user = token ? JSON.parse(localStorage.getItem("user")) : null;

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/mentor/${id}`)
            .then((res) => {
                if (res.data.success) {
                    setMentor(res.data.mentor);
                }
            })
            .catch(console.error);
    }, [id]);

    const times = [
        "10:00~11:00",
        "11:00~12:00",
        "12:00~13:00",
        "13:00~14:00",
        "14:00~15:00",
        "15:00~16:00",
        "16:00~17:00",
        "17:00~18:00",
        "18:00~19:00",
        "19:00~20:00",
        "21:00~22:00",
        "22:00~23:00",
    ];

    const handleApply = async () => {
        if (!token) {
            alert("로그인 후 신청 가능합니다.");
            navigate("/login");
            return;
        }

        if (!selectedDate || !selectedTime) {
            alert("날짜와 시간을 선택해주세요.");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:5000/api/mentor/apply",
                {
                    mentorId: mentor.id,
                    date: selectedDate,
                    time: selectedTime,
                    message,
                    price: mentor.price,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                alert("멘토링 신청이 완료되었습니다!");
            }
        } catch (err) {
            console.error(err);
            alert("신청 실패");
        }
    };

    if (!mentor) {
        return <div className="p-10 text-center">로딩중...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-10 flex gap-10">
            {/* 왼쪽 영역 */}
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-6">멘토링 신청</h1>

                {/* 멘토 정보 */}
                <div className="bg-white shadow rounded-2xl p-6 mb-6">
                    <h2 className="font-bold text-lg">{mentor.title}</h2>
                    <p className="text-gray-600">
                        {mentor.name} · {mentor.position}
                    </p>
                </div>

                {/* 일정 선택 */}
                <div className="bg-white shadow rounded-2xl p-6 mb-6">
                    <h2 className="font-bold mb-4">1. 일정 선택</h2>

                    <input
                        type="date"
                        className="border px-4 py-2 rounded-lg mb-4"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />

                    <div className="grid grid-cols-4 gap-4">
                        {times.map((time) => {
                            const isSelected = selectedTime === time;

                            return (
                                <button
                                    key={time}
                                    type="button"
                                    onClick={() => setSelectedTime(time)}
                                    style={{
                                        backgroundColor: isSelected ? "#22c55e" : "#ffffff",
                                        color: isSelected ? "#ffffff" : "#000000",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        padding: "12px",
                                        cursor: "pointer",
                                    }}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 메시지 */}
                <div className="bg-white shadow rounded-2xl p-6">
                    <h2 className="font-bold mb-2">2. 멘토에게 보낼 메시지</h2>
                    <textarea
                        className="w-full border rounded-lg p-3 h-32"
                        placeholder="궁금한 점이나 요청사항을 작성해주세요."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
            </div>

            {/* 오른쪽 영역 */}
            <div className="w-96">
                {/* 신청자 정보 */}
                <div className="bg-white shadow rounded-2xl p-6 mb-6">
                    <h2 className="font-bold mb-2">신청자 정보</h2>
                    <p>이름: {token ? user?.name : "-"}</p>
                    <p>이메일: {token ? user?.email : "-"}</p>
                </div>

                {/* 결제 */}
                <div className="bg-white shadow rounded-2xl p-6">
                    <p className="font-bold mb-2">총 결제 금액</p>
                    <p className="text-2xl font-bold mb-4">
                        ₩{mentor.price.toLocaleString()}
                    </p>

                    <button
                        onClick={handleApply}
                        style={{
                            width: "100%",
                            backgroundColor: "#22c55e",
                            color: "white",
                            padding: "12px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        결제하기
                    </button>
                </div>
                {/* 안내 문구 */}
                <div
                    style={{
                        marginTop: "16px",
                        backgroundColor: "#FEF9C3",
                        padding: "12px",
                        borderRadius: "8px",
                        fontSize: "15px",
                        color: "#92400E",
                        lineHeight: "1.6",
                    }}
                >
                    <strong>⚠️ 멘토링은 멘토 확정 후 진행됩니다.</strong>
                    <br />
                    신청 후 3일 내로 멘토링 진행 여부를 확인할 수 있습니다.
                    <br />
                    진행이 확정되면, 멘토와 세부 일정 조율 후 진행됩니다.
                </div>
            </div>
        </div>
    );
}
