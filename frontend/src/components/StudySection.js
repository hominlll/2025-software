import React, { useEffect, useState } from "react";
import axios from "axios";
import StudyCard from "./StudyCard";

const StudySection = () => {
    const [studies, setStudies] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/study") // ← 수정됨
            .then((res) => setStudies(res.data))
            .catch((err) => console.error("스터디 목록 불러오기 오류:", err));
    }, []);

    return (
        <div className="px-10 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-8">
            {studies.length === 0 ? (
                <p className="text-gray-500 text-center col-span-4">
                    등록된 스터디가 없습니다.
                </p>
            ) : (
                studies.map((study) => (
                    <StudyCard key={study.id} study={study} />
                ))
            )}
        </div>
    );
};

export default StudySection;
