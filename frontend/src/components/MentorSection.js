import React, { useEffect, useState } from "react";
import axios from "axios";
import MentorCard from "./MentorCard";

const MentorSection = ({ selectedCategory, searchText }) => {
  const [mentors, setMentors] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // 전체 멘토 데이터 불러오기
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/mentors")
      .then((res) => {
        setMentors(res.data);
        setFiltered(res.data); // 초기 전체 출력
      })
      .catch((err) => console.error("멘토 데이터 불러오기 실패:", err));
  }, []);

  // 카테고리 + 검색 필터링
  useEffect(() => {
    let result = [...mentors];

    // 1) 카테고리 필터
    const category = selectedCategory?.trim();
    if (category && category !== "전체") {
      result = result.filter((m) => m.category === category);
    }

    // 2) 검색 필터 (이름 / 제목 / 내용 등 원하는 필드)
    if (searchText && searchText.trim() !== "") {
      const q = searchText.trim().toLowerCase();
      result = result.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.title?.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [selectedCategory, searchText, mentors]);

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
