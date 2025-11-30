const StudyCard = ({ study }) => {
    return (
        <div className="w-85 bg-white shadow-md rounded-2xl p-4 hover:shadow-xl transition">

            {/* 스터디 대표 이미지 (없으면 기본 이미지) */}
            <img
                src={study.image || "/img/default-study.png"}
                alt={study.studyName}
                className="w-full h-40 object-cover rounded-xl"
            />

            <h3 className="mt-3 text-lg font-semibold">{study.studyName}</h3>

            <p className="text-gray-600 text-sm">
                작성자: {study.writer} / 분야: {study.category}
            </p>

            <p className="mt-1 text-gray-500 text-sm">
                마감일: {new Date(study.deadline).toLocaleDateString()}
            </p>

            <p className="mt-1 text-gray-500 text-sm">
                진행 방식: {study.method} / 기간: {study.duration}
            </p>

            <p className="mt-1 text-gray-500 text-sm">
                모집 인원: {study.maxPeople}명
            </p>

            {/* 스터디 설명 */}
            <p className="mt-2 text-gray-700 text-sm">{study.description}</p>

            {/* 태그 */}
            {study.tags && study.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                    {study.tags.split(',').map(tag => (
                        <span
                            key={tag}
                            className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudyCard;
