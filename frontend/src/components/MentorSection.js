import React, { useEffect, useState } from "react";
import axios from "axios";
import MentorCard from "./MentorCard";

const MentorSection = ({ selectedCategory }) => {
  const [mentors, setMentors] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // 전체 멘토 데이터 불러오기
  useEffect(() => {
    axios
      .get("http://localhost:5000/mentors")
      .then((res) => {
        setMentors(res.data);
        setFiltered(res.data); // 초기 전체 출력
      })
      .catch((err) => console.error("멘토 데이터 불러오기 실패:", err));
  }, []);

  // 카테고리 변경 시 필터링
  useEffect(() => {
    const category = selectedCategory?.trim();  // 🔥 공백 제거

    if (!category || category === "전체") {
      setFiltered(mentors); // 🔥 전체 출력 확정
    } else {
      setFiltered(mentors.filter((m) => m.category === category));
    }
  }, [selectedCategory, mentors]);

  return (
    <div className="px-10 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center col-span-full">
          불러올 멘토가 없습니다.
        </p>
      ) : (
        filtered.map((mentor) => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))
      )}
    </div>
  );
};

export default MentorSection;
