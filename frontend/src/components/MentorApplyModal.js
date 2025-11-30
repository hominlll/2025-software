import React, { useState } from "react";
import axios from "axios";

export default function MentorApplyModal({ onClose, userNickname }) {
    const [title, setTitle] = useState("");
    const [career, setCareer] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        if (!title || !career || !description) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        const newMentor = {
            writer: userNickname,
            title,
            career,
            description,
        };

        try {
            const res = await axios.post("http://localhost:5000/api/mentor", newMentor);
            if (res.data.success) {
                alert("멘토 지원 성공!");
                onClose();
            } else {
                alert("멘토 지원 실패: " + res.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("멘토 등록 실패: 서버 오류");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[500px] rounded-2xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">멘토 지원서 작성</h2>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">작성자</label>
                        <input
                            type="text"
                            value={userNickname || ""}
                            readOnly
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">멘토 분야 / 제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="예: 프론트엔드 취업 멘토링"
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">경력</label>
                        <input
                            type="text"
                            value={career}
                            onChange={(e) => setCareer(e.target.value)}
                            placeholder="예: 5년 차 백엔드 개발자"
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">멘토링 소개</label>
                        <textarea
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="멘토링 내용, 방식 등을 상세히 작성해주세요."
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none resize-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm bg-gray-400 text-white hover:bg-red-500 transition-colors duration-300"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 hover:shadow-md"
                    >
                        등록하기
                    </button>
                </div>
            </div>
        </div>
    );
}
