import React from "react";
import { useNavigate } from "react-router-dom";

const StudyCard = ({ study }) => {
  const navigate = useNavigate();

  const participantsCount = study.participantCount ?? 0;
  const maxPeople = study.maxPeople ?? 0;
  const views = study.views ?? 0;

  const remainingSpots = maxPeople - participantsCount;
  const now = new Date();
  const deadline = study.deadline ? new Date(study.deadline) : null;

  let status = "모집중";
  if (remainingSpots <= 0 || (deadline && deadline <= now)) {
    status = "모집완료";
  } else if (
    remainingSpots <= 1 ||
    (deadline && (deadline - now) / (1000 * 60 * 60 * 24) <= 1)
  ) {
    status = "모집마감임박";
  }

  const tags = [];
  if (status === "모집마감임박") tags.push("마감임박");
  if (status === "모집완료") tags.push("모집마감");

  const handleClick = () => {
    navigate(`/study/${study.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative rounded-2xl shadow-md p-4 w-[260px] h-[200px] flex flex-col justify-between bg-white
                  hover:shadow-lg transition-all duration-200
                  cursor-pointer`}
    >
      {status === "모집완료" && (
        <div className="absolute inset-0 bg-gray-400 opacity-50 rounded-2xl pointer-events-none z-10" />
      )}

      <div className="flex flex-col justify-between h-full z-20 relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-blue-100 px-3 py-1 rounded-full text-gray-600">
            스터디
          </span>
          <span className="text-xs bg-green-100 px-3 py-1 rounded-full text-gray-600">
            {study.category || "정보 없음"}
          </span>
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-xs px-3 py-1 rounded-full ${
                tag === "마감임박"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mb-1 text-sm text-gray-500">
          <span>
            마감일 | {deadline ? deadline.toLocaleDateString() : "미정"}
          </span>
          <span>
            👥 {participantsCount} / {maxPeople}명
          </span>
        </div>

        <h3 className="font-semibold text-base mb-2 leading-6">
          {study.studyName || "제목 없음"}
        </h3>

        <div className="flex justify-between items-center text-gray-500 text-sm pt-3 border-t">
          <p className="text-sm text-gray-600 mb-0">
            👤 {study.writer || study.userId}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">👁️ {views}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyCard;
