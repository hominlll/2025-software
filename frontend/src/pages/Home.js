import React, { useState } from "react";
import MentorBanner from "../components/MentorBanner";
import StudyBanner from "../components/StudyBanner";
import MentorSection from "../components/MentorSection";
import StudyCreateModal from "../components/StudyCreateModal";

const Home = ({ selectedTab, userNickname }) => {
    const [showStudyModal, setShowStudyModal] = useState(false);

    const handleStudySubmit = (newStudy) => {
        console.log("새 스터디 등록:", newStudy);
        // 🔹 백엔드 API 호출 추가
    };

    return (
        <div>
            {/* 멘토링 배너 + 섹션 */}
            {selectedTab === "mentoring" && (
                <>
                    <MentorBanner />
                    <MentorSection />
                </>
            )}

            {/* 스터디 배너 + 모달 */}
            {selectedTab === "study" && (
                <>
                    <StudyBanner onCreateClick={() => setShowStudyModal(true)} />
                    {showStudyModal && (
                        <StudyCreateModal
                            onClose={() => setShowStudyModal(false)}
                            onSubmit={handleStudySubmit}
                            userNickname={userNickname}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
