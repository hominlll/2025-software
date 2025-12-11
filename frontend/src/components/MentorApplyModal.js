// frontend/src/components/MentorApplyModal.js
import React, { useState } from "react";
import axios from "axios";

const CATEGORIES = [
    '경영', '경제', '교육', '법',
    '디자인', '기계', '전기·전자', '컴퓨터공학',
    '화학', '생명', '면접',
];

export default function MentorApplyModal({ onClose, userNickname }) {
    const [name, setName] = useState(userNickname || "");
    const [position, setPosition] = useState("");
    const [experience, setExperience] = useState("");
    const [company, setCompany] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState(""); // 새로 추가된 학과(카테고리)
    const [tags, setTags] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState(""); // 저장된 이미지 URL
    const [description, setDescription] = useState("");

    const rating = 0;
    const reviews = 0;

    // 이미지 파일 선택 후 서버 업로드
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 간단한 파일 타입/사이즈 검증 (선택)
        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드할 수 있습니다.");
            return;
        }
        // 예: 5MB 제한
        const maxMB = 5;
        if (file.size > maxMB * 1024 * 1024) {
            alert(`${maxMB}MB 이하의 이미지를 업로드해주세요.`);
            return;
        }

        setImageFile(file);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await axios.post("http://localhost:5000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // 백엔드에서 { success: true, url: "http://.../uploads/..." } 반환한다고 가정
            if (res.data && res.data.url) {
                setImage(res.data.url);
            } else {
                alert("이미지 업로드에 실패했습니다.");
                console.error("업로드 응답:", res.data);
            }
        } catch (err) {
            console.error("이미지 업로드 오류:", err);
            alert("이미지 업로드 실패 (서버 오류)");
        }
    };

    const handleSubmit = async () => {
        // 필수 항목 확인 (카테고리 포함)
        if (!name || !position || !experience || !company || !price || !category || !tags || !image || !description) {
            alert("모든 필드를 입력해주세요. (카테고리 선택 포함)");
            return;
        }

        const newMentor = {
            name,
            position,
            experience,
            company,
            rating,
            reviews,
            price: Number(price),
            category,
            tags,      // 예: "프로그래밍,면접"
            image,     // 업로드 후 받은 URL
            description
        };

        try {
            const res = await axios.post("http://localhost:5000/api/mentor", newMentor);

            if (res.data && res.data.success) {
                alert("멘토 등록 성공!");
                onClose();
                // 화면 갱신 방식 (간단)
                window.location.reload();
            } else {
                alert("멘토 등록 실패: " + (res.data?.message || "서버 오류"));
                console.error("멘토 등록 실패 응답:", res.data);
            }
        } catch (err) {
            console.error("멘토 등록 오류:", err);
            alert("멘토 등록 실패: 서버 오류");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-[520px] rounded-2xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">멘토 등록</h2>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">멘토명</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">직무</label>
                        <input
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">경력</label>
                        <input
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">회사명</label>
                        <input
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">가격(₩)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">카테고리</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        >
                            <option value="">카테고리 선택</option>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">태그(,로 구분)</label>
                        <input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                            placeholder="예: Java,코딩 테스트,면접"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">이미지 업로드</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                        {image && (
                            <img src={image} alt="preview" className="mt-3 h-32 w-32 object-cover rounded-lg border" />
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">멘토 상세 소개</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm resize-none"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="rounded-lg bg-gray-400 text-white px-4 py-2 text-sm">
                        취소
                    </button>
                    <button onClick={handleSubmit} className="rounded-lg bg-emerald-500 text-white px-4 py-2 text-sm">
                        등록하기
                    </button>
                </div>
            </div>
        </div>
    );
}
