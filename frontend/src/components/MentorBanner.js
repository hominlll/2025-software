import React from "react";

const Banner = () => {
  return (
    <section className="mx-12 my-8 rounded-2xl border border-green-100 bg-gradient-to-r from-emerald-50 via-white to-sky-50 shadow-sm">
      <div className="flex flex-col items-center px-10 py-8 text-center">
       

        <h2 className="mt-2 text-2xl font-bold text-gray-900">
          누구나 멘토가 될 수 있어요.
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          지식과 경험을 나누고, 의미 있는 인사이트를 전해주세요!
        </p>

        <button
          className="mt-6 rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-600 hover:shadow-lg active:translate-y-[1px]"
        >
          멘토 지원하기
        </button>
      </div>
    </section>
  );
};

export default Banner;
