import React, { useState } from "react";
import axios from "axios";

const CATEGORIES = [
    '경영', '경제', '교육', '법',
    '디자인', '기계', '전기·전자', '컴퓨터공학',
    '화학', '생명', '면접',
];

const EXPERIENCES = [
    "주니어(1~3년)",
    "미들(3~5년)",
    "시니어(5~8년 이상)",
];

// ✅ frontend 기본 이미지
const DEFAULT_IMAGE = "/img/logo.png";

export default function MentorApplyModal({ onClose, userNickname }) {
    const [name, setName] = useState(userNickname || "");
    const [title, setTitle] = useState("");
    const [position, setPosition] = useState("");
    const [experience, setExperience] = useState("");
    const [company, setCompany] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [image, setImage] = useState(DEFAULT_IMAGE); // ⭐ 기본 이미지
    const [imageFile, setImageFile] = useState(null);
    const [description, setDescription] = useState("");
    const [mentoringMethod, setMentoringMethod] = useState("");
    const [loading, setLoading] = useState(false);

    const rating = 0;
    const reviews = 0;

    // 이미지 업로드 (선택)
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드할 수 있습니다.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("5MB 이하의 파일만 업로드할 수 있습니다.");
            return;
        }

        setImageFile(file);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await axios.post(
                "http://localhost:5000/api/upload",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (res.data && res.data.url) {
                setImage(res.data.url);
            } else {
                setImage(DEFAULT_IMAGE);
            }
        } catch (err) {
            console.error("이미지 업로드 오류:", err);
            alert("이미지 업로드 실패 (서버 오류)");
            setImage(DEFAULT_IMAGE);
        }
    };

    const handleSubmit = async () => {
        if (loading) return;

        if (
            !name ||
            !title ||
            !position ||
            !experience ||
            !company ||
            !price ||
            !category ||
            !tags ||
            !description ||
            !mentoringMethod
        ) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        const newMentor = {
            name,
            title,
            position,
            experience,
            company,
            rating,
            reviews,
            price: Number(price),
            category,
            tags: tags.trim(),
            image: image || DEFAULT_IMAGE, // ⭐ 안전장치
            description,
            mentoringMethod,
        };

        try {
            setLoading(true);

            const res = await axios.post(
                "http://localhost:5000/api/mentor",
                newMentor
            );

            if (res.data?.success) {
                alert("멘토 등록 성공!");
                onClose();
                window.location.reload();
            } else {
                alert("멘토 등록 실패");
            }
        } catch (err) {
            console.error("멘토 등록 오류:", err);
            alert("멘토 등록 실패 (서버 오류)");
        } finally {
            setLoading(false);
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
                        <label className="text-sm font-medium">멘토 제목</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">멘토명</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">직무</label>
                        <input
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">경력</label>
                        <select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        >
                            <option value="">경력 선택</option>
                            {EXPERIENCES.map((exp) => (
                                <option key={exp} value={exp}>{exp}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">회사명</label>
                        <input
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">가격(₩) / 1시간</label>
                        <input
                            type="number"
                            step={1000}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">카테고리</label>
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
                        <label className="text-sm font-medium">태그(,로 구분)</label>
                        <input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">프로필 사진 업로드 (미첨부시 로고 대체)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        />
                        <img
                            src={image}
                            alt="preview"
                            className="mt-3 h-32 w-32 object-cover rounded-lg border"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">멘토 상세 소개</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm resize-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">멘토링 방식</label>
                        <textarea
                            value={mentoringMethod}
                            onChange={(e) => setMentoringMethod(e.target.value)}
                            rows={3}
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm resize-none"
                            placeholder="예: Zoom 비대면 / 1:1 / 과제 피드백 포함"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-400 text-white px-4 py-2 text-sm"
                    >
                        취소
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-lg bg-emerald-500 disabled:bg-gray-300 text-white px-4 py-2 text-sm"
                    >
                        {loading ? "등록 중..." : "등록하기"}
                    </button>
                </div>
            </div>
        </div>
    );
}
