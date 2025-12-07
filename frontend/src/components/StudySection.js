import React, { useEffect, useState } from "react";
import axios from "axios";
import StudyCard from "./StudyCard";

const StudySection = ({
  refresh,
  selectedCategory,
  searchText,
  selectedStatus,
  userNickname,
  currentUserId
}) => {
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
  }, [refresh]);

  let filtered =
    !selectedCategory || selectedCategory === "전체"
      ? studies
      : studies.filter((study) => study.category === selectedCategory);

  if (searchText) {
    const lower = searchText.toLowerCase();
    filtered = filtered.filter((study) =>
      study.studyName.toLowerCase().includes(lower)
    );
  }

  if (selectedStatus) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 제거
    filtered = filtered.filter((study) => {
      const deadline = study.deadline ? new Date(study.deadline) : null;
      const remainingSpots = study.maxPeople - study.participantCount;
      const daysLeft = deadline ? Math.floor((deadline - today)/(1000*60*60*24)) : null;

      switch (selectedStatus) {
        case "모집중":
          return remainingSpots > 0 && (!deadline || daysLeft >= 0);
        case "마감임박":
          return remainingSpots > 0 && (remainingSpots === 1 || (daysLeft !== null && daysLeft <= 1));
        case "모집마감":
          return remainingSpots <= 0 || (daysLeft !== null && daysLeft < 0);
        default:
          return true;
      }
    });
  }

  return (
    <div className="w-[70%] mx-auto py-8">
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center">등록된 스터디가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 justify-items-center">
          {filtered.map((study) => {
            const displayStudy =
              study.userId === currentUserId
                ? { ...study, writer: userNickname }
                : study;

            return <StudyCard key={study.id} study={displayStudy} />;
          })}
        </div>
      )}
    </div>
  );
};

export default StudySection;
