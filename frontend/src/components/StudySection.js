import React, { useEffect, useState } from "react";
import axios from "axios";
import StudyCard from "./StudyCard";

const StudySection = ({ refresh, selectedCategory }) => {
  const [studies, setStudies] = useState([]);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/studies");
        setStudies(res.data);
      } catch (err) {
        console.error("스터디 목록 불러오기 오류:", err);
      }
    };

    fetchStudies();
  }, [refresh]);  // ← 등록 후 refresh가 바뀌면 목록 새로고침

  // ⭐ 카테고리 필터링 로직 수정!
  const filteredStudies =
    !selectedCategory || selectedCategory === "전체"
      ? studies
      : studies.filter((study) => study.category === selectedCategory);

  return (
    <div className="w-[70%] mx-auto py-8">
      {filteredStudies.length === 0 ? (
        <p className="text-gray-500 text-center">등록된 스터디가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 justify-items-center">
          {filteredStudies.map((study) => (
            <StudyCard key={study.id} study={study} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudySection;
