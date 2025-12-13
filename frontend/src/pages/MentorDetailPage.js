import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function MentorDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mentor, setMentor] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/mentor/${id}`)
            .then((res) => {
                if (res.data.success) setMentor(res.data.mentor);
            })
            .catch(console.error);
    }, [id]);

    if (!mentor) {
        return <div className="p-10 text-center">멘토 정보를 불러오는 중...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-8">

            {/* 🔹 상단 프로필 카드 (기존 디자인 유지) */}
            <div className="flex gap-10 items-center bg-white shadow-md rounded-2xl p-8">
                <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-48 h-48 rounded-2xl object-cover"
                />

                <div className="flex-1 flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">{mentor.title}</h1>

                    <p className="text-gray-600 text-lg">
                        {mentor.name} · {mentor.position}
                    </p>

                    <p className="text-gray-500">
                        {mentor.company} · {mentor.experience}
                    </p>

                    <p className="text-yellow-500 font-semibold text-lg">
                        ⭐ {mentor.rating} / 5.0 ({mentor.reviews}개 리뷰)
                    </p>

                    <p className="text-blue-600 font-bold text-xl mt-2">
                        ₩{mentor.price.toLocaleString()} / 1시간
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {mentor.tags.split(",").map((tag) => (
                            <span
                                key={tag}
                                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 🔹 신청 버튼 */}
                <div className="flex flex-col justify-end">
                    <button
                        onClick={() => navigate(`/mentor/${mentor.id}/enrollment`)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold"
                    >
                        멘토링 신청하기
                    </button>
                </div>
            </div>

            {/* 🔹 멘토 소개 */}
            <div className="mt-10 bg-white shadow-md rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4">멘토 소개</h2>
                <p className="text-gray-700 leading-7">
                    {mentor.description || "등록된 멘토 소개가 없습니다."}
                </p>
            </div>

            {/* 🔹 멘토링 방식 */}
            <div className="mt-10 bg-white shadow-md rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4">멘토링 방식</h2>
                <ul className="list-disc pl-5 text-gray-700 leading-7">
                    <li>사전 질문을 기반으로 맞춤형 멘토링</li>
                    <li>실무 중심 코드 리뷰 및 커리어 상담</li>
                    <li>Zoom / Google Meet을 통한 비대면 진행</li>
                </ul>
            </div>

            {/* 🔹 리뷰 */}
            <div className="mt-10 bg-white shadow-md rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4">멘토링 리뷰</h2>

                <div className="flex flex-col gap-5">
                    <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
                        <p className="font-semibold">⭐ 5.0</p>
                        <p className="text-gray-600 mt-1">
                            정말 많은 도움이 되었습니다! 실무적인 조언이 최고예요.
                        </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
                        <p className="font-semibold">⭐ 4.8</p>
                        <p className="text-gray-600 mt-1">
                            방향성을 잡는 데 큰 도움이 되었습니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
