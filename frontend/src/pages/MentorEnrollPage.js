import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function MentorEnrollPage() {
    const { id } = useParams();
    const [mentor, setMentor] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/mentor/${id}`).then((res) => {
            if (res.data.success) setMentor(res.data.mentor);
        });
    }, [id]);

    if (!mentor) return null;

    return (
        <div className="max-w-4xl mx-auto p-10">
            <h1 className="text-3xl font-bold mb-6">멘토링 신청</h1>

            <div className="bg-white shadow rounded-2xl p-8 flex justify-between">
                <div>
                    <h2 className="text-xl font-bold">{mentor.title}</h2>
                    <p className="text-gray-600 mt-1">
                        {mentor.name} · {mentor.position}
                    </p>
                </div>

                <p className="text-2xl font-bold">
                    ₩{mentor.price.toLocaleString()}
                </p>
            </div>

            <div className="mt-8 bg-white shadow rounded-2xl p-8">
                <h2 className="text-xl font-bold mb-4">유의사항</h2>
                <ul className="list-disc pl-5 text-gray-600">
                    <li>멘토 승인 후 일정이 확정됩니다.</li>
                </ul>

                <button
                    onClick={() => alert("멘토링 신청이 완료되었습니다!")}
                    className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold"
                >
                    신청하기
                </button>
            </div>
        </div>
    );
}
