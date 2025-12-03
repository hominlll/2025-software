import React, { useState } from "react";
import StudyCreateModal from "./StudyCreateModal";
import StudySection from "./StudySection";

const StudyBanner = ({ userNickname }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false); // 스터디 등록 후 섹션 새로고침용

  const handleCloseModal = (shouldRefresh = false) => {
    setIsModalOpen(false);
    if (shouldRefresh) setRefresh(!refresh); // 섹션 새로고침
  };

  return (
    <>
      {/* 배너 */}
      <section className="mx-12 my-8 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 shadow-sm">
        <div className="flex flex-col items-center px-10 py-8 text-center">
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            스터디 그룹을 만들어 보세요!
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            관심 있는 주제로 사람들과 함께 학습하고 성장해보세요.
          </p>
          <button
            className="mt-6 rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-600 hover:shadow-lg active:translate-y-[1px]"
            onClick={() => setIsModalOpen(true)}
          >
            스터디 만들기
          </button>
        </div>
      </section>

      {/* 모달 */}
      {isModalOpen && (
        <StudyCreateModal
          onClose={handleCloseModal}
          userNickname={userNickname} // ← 여기서 props로 전달
        />
      )}

      {/* 스터디 카드 섹션 */}
      <StudySection key={refresh} />
    </>
  );
};

export default StudyBanner;
