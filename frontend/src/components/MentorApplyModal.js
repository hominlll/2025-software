import React, { useState } from "react";
import axios from "axios";

export default function MentorApplyModal({ onClose, userNickname }) {
    const [name, setName] = useState(userNickname || "");   // mentor.name
    const [position, setPosition] = useState("");           // mentor.position
    const [experience, setExperience] = useState("");       // mentor.experience
    const [company, setCompany] = useState("");             // mentor.company
    const [price, setPrice] = useState("");                 // mentor.price
    const [tags, setTags] = useState("");                   // mentor.tags
    const [image, setImage] = useState("");                 // mentor.image
    const rating = 0;
    const reviews = 0;

    const handleSubmit = async () => {
        if (!name || !position || !experience || !company || !price || !tags || !image) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        const newMentor = {
            name,
            position,
            experience,
            company,
            rating,
            reviews,
            price,
            tags,
            image
        };

        try {
            const res = await axios.post("http://localhost:5000/api/mentor", newMentor);
            if (res.data.success) {
                alert("멘토 등록 성공!");
                onClose();
                window.location.reload(); // 새 멘토가 즉시 화면에 나타나도록 새로고침
            } else {
                alert("멘토 등록 실패: " + res.data.message);
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
                    <h2 className="text-xl font-bold text-gray-900">멘토 등록</h2>
                </div>

                <div className="flex flex-col gap-4">

                    <div>
                        <label className="text-sm font-medium text-gray-700">이름</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none"
                            placeholder="예: 홍길동"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">직무</label>
                        <input type="text" value={position} onChange={(e) => setPosition(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none"
                            placeholder="예: 프론트엔드 개발자"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">경력</label>
                        <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none"
                            placeholder="예: 3년차 개발자"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">회사명</label>
                        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none"
                            placeholder="예: 네이버"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">가격 (₩)</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none"
                            placeholder="예: 50000"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">태그 (쉼표로 구분)</label>
                        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none"
                            placeholder="예: React, JavaScript"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">이미지 URL</label>
                        <input type="text" value={image} onChange={(e) => setImage(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none"
                            placeholder="예: https://example.com/myimage.jpg"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose}
                        className="rounded-lg bg-gray-400 text-white px-4 py-2 text-sm">
                        취소
                    </button>

                    <button onClick={handleSubmit}
                        className="rounded-lg bg-emerald-500 text-white px-4 py-2 text-sm">
                        등록하기
                    </button>
                </div>
            </div>
        </div>
    );
}
