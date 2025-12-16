import React from "react";
import { useNavigate } from "react-router-dom";

const StudyCard = ({ study }) => {
  const navigate = useNavigate();

  const participantsCount = study.participantCount ?? 0;
  const maxPeople = study.maxPeople ?? 0;
  const views = study.views ?? 0;

  const remainingSpots = maxPeople - participantsCount;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = study.deadline ? new Date(study.deadline) : null;

  let status = "모집중";
  if (remainingSpots <= 0 || (deadline && deadline < today)) {
    status = "모집완료";
  } else if (
    remainingSpots <= 1 ||
    (deadline && (deadline - today) / (1000 * 60 * 60 * 24) <= 1)
  ) {
    status = "모집마감임박";
  }

  const tags = [];
  if (status === "모집마감임박") tags.push("마감임박");
  if (status === "모집완료") tags.push("모집마감");

  return (
    <div
      onClick={() => navigate(`/study/${study.id}`)}
      className="
        relative
        w-full
        min-h-[200px]
        rounded-2xl
        bg-white
        p-4
        shadow-md
        flex flex-col justify-between
        hover:shadow-lg
        transition-all
        cursor-pointer
      "
    >
      {status === "모집완료" && (
        <div className="absolute inset-0 bg-gray-400 opacity-50 rounded-2xl z-10" />
      )}

      <div className="relative z-20 flex flex-col h-full">
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="text-xs bg-blue-100 px-3 py-1 rounded-full">
            스터디
          </span>
          <span className="text-xs bg-green-100 px-3 py-1 rounded-full">
            {study.category}
          </span>
          {tags.map(tag => (
            <span
              key={tag}
              className={`text-xs px-3 py-1 rounded-full ${tag === "마감임박"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
                }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>
            마감일 | {deadline ? deadline.toLocaleDateString() : "미정"}
          </span>
          <span>
            👥 {participantsCount} / {maxPeople}
          </span>
        </div>

        <h3 className="font-semibold text-base leading-6 mb-2 line-clamp-2">
          {study.studyName}
        </h3>

        <div className="mt-auto flex justify-between items-center text-sm text-gray-500 pt-3 border-t">
          <span>👤 {study.writer}</span>
          <span>👁️ {views}</span>
        </div>
      </div>
    </div>
  );
};

export default StudyCard;
