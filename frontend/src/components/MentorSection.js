import React, { useEffect, useState } from "react";
import axios from "axios";
import MentorCard from "./MentorCard";

const MentorSection = ({ selectedCategory, searchText }) => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);

        const res = await axios.get("http://localhost:5000/api/mentors", {
          params: {
            category: selectedCategory,
            search: searchText,
          },
        });

        setMentors(res.data);
      } catch (err) {
        console.error("멘토 목록 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [selectedCategory, searchText]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        멘토를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="px-10 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {mentors.length === 0 ? (
        <p className="text-gray-500 text-center col-span-full">
          검색 결과가 없습니다.
        </p>
      ) : (
        mentors.map((mentor) => (
          <MentorCard key={mentor.id} mentor={mentor} />
        ))
      )}
    </div>
  );
};

export default MentorSection;
