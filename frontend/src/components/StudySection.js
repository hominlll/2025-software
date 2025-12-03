import React, { useEffect, useState } from "react";
import axios from "axios";
import StudyCard from "./StudyCard";

const StudySection = ({ refresh }) => {
    const [studies, setStudies] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/studies")
            .then((res) => {
                console.log("📌 API 데이터:", res.data);
                setStudies(res.data);
            })
            .catch((err) => console.error("스터디 목록 불러오기 오류:", err));
    }, [refresh]);

    return (
        <div className="w-[70%] mx-auto py-8">
            {studies.length === 0 ? (
                <p className="text-gray-500 text-center">
                    등록된 스터디가 없습니다.
                </p>
            ) : (
                <div className="px-8 py-8
                                grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5
                                gap-4 justify-items-center">
                    {studies.map((study) => (
                        <StudyCard key={study.id} study={study} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudySection;
