import React from "react";

const StudyBanner = () => {
  return (
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
        >
          스터디 만들기
        </button>
      </div>
    </section>
  );
};

export default StudyBanner;
