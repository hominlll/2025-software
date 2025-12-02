import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function MentorDetailPage() {
    const { id } = useParams();
    const [mentor, setMentor] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/mentor/${id}`)
            .then((res) => {
                if (res.data.success) setMentor(res.data.mentor);
            })
            .catch((err) => console.error(err));
    }, [id]);

    if (!mentor) return <div className="p-10 text-center">멘토 정보를 불러오는 중...</div>;

    return (
        <div className="max-w-5xl mx-auto p-8">

            {/* 상단 프로필 영역 */}
            <div className="flex gap-10 items-center bg-white shadow-md rounded-2xl p-8">
                <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-48 h-48 rounded-2xl object-cover"
                />

                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">{mentor.name}</h1>

                    <p className="text-gray-600 text-lg">
                        {mentor.position} · {mentor.experience}
                    </p>

                    <p className="text-gray-500">{mentor.company}</p>

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
            </div>

            {/* 상세 설명 */}
            <div className="mt-10 bg-white shadow-md rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4">멘토 소개</h2>
                <p className="text-gray-700 leading-7">
                    {mentor.description || "등록된 상세 소개가 없습니다."}
                </p>
            </div>

            {/* 리뷰 섹션 (현재는 샘플 목업) */}
            <div className="mt-10 bg-white shadow-md rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4">멘토링 리뷰</h2>

                <p className="text-gray-500 text-sm">
                    현재 리뷰 데이터베이스가 없어서 샘플 리뷰를 표시합니다.
                </p>

                <div className="mt-5 flex flex-col gap-5">
                    <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
                        <p className="font-semibold">⭐ 5.0</p>
                        <p className="text-gray-600 mt-1">정말 많은 도움이 되었습니다! 설명도 친절하고 경험도 풍부하십니다.</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
                        <p className="font-semibold">⭐ 5.0</p>
                        <p className="text-gray-600 mt-1">코칭을 받고 방향성을 확실히 잡을 수 있었습니다.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
