import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StudyDetail = () => {
  const { id } = useParams(); // URL 파라미터에서 study id 가져오기
  const [study, setStudy] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/studies/${id}`)
      .then((res) => setStudy(res.data))
      .catch((err) => console.error("스터디 상세 불러오기 오류:", err));
  }, [id]);

  if (!study) return <p className="text-center mt-10">로딩중...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      
      {/* 제목 */}
      <h1 className="text-2xl font-bold mb-4">{study.studyName}</h1>

      {/* 태그 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {study.tags &&
          study.tags.split(",").map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
            >
              #{tag.trim()}
            </span>
          ))}
      </div>

      {/* 기본 정보 */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1">
          <p>
            <strong>작성자:</strong> {study.writer || "정보 없음"}
          </p>
          <p>
            <strong>분야:</strong> {study.category || "정보 없음"}
          </p>
          <p>
            <strong>마감일:</strong>{" "}
            {study.deadline
              ? new Date(study.deadline).toLocaleDateString()
              : "미정"}
          </p>
          <p>
            <strong>진행 방식:</strong> {study.method || "미정"}
          </p>
          <p>
            <strong>모집 인원:</strong> {study.maxPeople || "정보 없음"}명
          </p>
        </div>

        {/* 대표 이미지 */}
        <div className="flex-1">
          <img
            src={study.image || "/img/default-study.png"}
            alt={study.studyName}
            className="w-full h-60 object-cover rounded-xl"
          />
        </div>
      </div>

      {/* 스터디 설명 */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">스터디 소개</h2>
        <p className="text-gray-700">{study.description || "내용 없음"}</p>
      </div>

      {/* 조회수 / 댓글 */}
      <div className="flex gap-6 text-gray-500">
        <p>👁️ {study.views || 0}</p>
        <p>💬 {study.comments || 0}</p>
      </div>
    </div>
  );
};

export default StudyDetailPage;
