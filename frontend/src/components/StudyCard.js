import React from "react";

const StudyCard = ({ study }) => {
    return (
            <div className="bg-white rounded-2xl shadow-md p-4 cursor-pointer
                            hover:shadow-lg transition-all duration-200
                            w-[260px] h-[200px] flex flex-col justify-between">

            {/* 태그 영역 */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-blue-100 px-3 py-1 rounded-full text-gray-600">
                   스터디
                </span>
                <span className="text-xs bg-green-100 px-3 py-1 rounded-full text-gray-600">
                   {study.category || "정보 없음"}
                </span>
                <span className="text-xs bg-yellow-100 px-3 py-1 rounded-full text-yellow-700">
                    마감임박 🔥
                </span>
            </div>

            {/* 마감일 */}
            <p className="text-sm text-gray-500 mb-1">
                마감일 | {study.deadline ? new Date(study.deadline).toLocaleDateString() : "미정"}
            </p>

            {/* 제목 */}
            <h3 className="font-semibold text-base mb-2 leading-6">
                {study.studyName || "제목 없음"}
            </h3>

            {/* 태그 */}
            {study.tags && study.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {study.tags.split(',').map(tag => (
                        <span
                            key={tag}
                            className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                        >
                            #{tag.trim()}
                        </span>
                    ))}
                </div>
            )}

            {/* 조회수 / 댓글수 (emoji로 대체) */}
            <div className="flex justify-between items-center text-gray-500 text-sm pt-3 border-t">
                {/* 왼쪽: 작성자 */}
                <p className="text-sm text-gray-600 mb-0">
                    👤 {study.writer || "정보 없음"}
                </p>

                {/* 오른쪽: 조회수 + 댓글 */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        👁️ {study.views || 0}
                    </div>
                    <div className="flex items-center gap-1">
                        💬 {study.comments || 0}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyCard;
