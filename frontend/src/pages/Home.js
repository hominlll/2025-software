// file: frontend/src/pages/Home.js
import React, { useState, useEffect } from "react";
import MentorBanner from "../components/MentorBanner";
import StudyBanner from "../components/StudyBanner";
import MentorSection from "../components/MentorSection";
import StudyCreateModal from "../components/StudyCreateModal";
import StudyCard from "../components/StudyCard";

const Home = ({ selectedTab, userNickname }) => {
    const [showStudyModal, setShowStudyModal] = useState(false);
    const [studies, setStudies] = useState([]);

    // 스터디 목록 가져오기
    useEffect(() => {
        if (selectedTab === "study") {
            fetch("http://localhost:5000/api/study")
                .then(res => res.json())
                .then(data => setStudies(data))
                .catch(err => console.error(err));
        }
    }, [selectedTab]);

    // 스터디 등록
    const handleStudySubmit = async (newStudy) => {
        try {
            // maxPeople 숫자 변환
            const studyToSend = { ...newStudy, maxPeople: Number(newStudy.maxPeople) };

            const res = await fetch("http://localhost:5000/api/study", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(studyToSend),
            });

            const data = await res.json();

            if (data.success) {
                alert("스터디 등록 성공!");
                // 새 스터디를 목록 맨 앞에 추가
                setStudies(prev => [{ ...studyToSend, id: data.id }, ...prev]);
                setShowStudyModal(false);
            } else {
                alert("스터디 등록 실패: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("스터디 등록 실패: 서버 오류");
        }
    };

    return (
        <div>
            {/* 멘토링 섹션 */}
            {selectedTab === "mentoring" && (
                <>
                    <MentorBanner userNickname={userNickname} />
                    <MentorSection />
                </>
            )}

            {/* 스터디 섹션 */}
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

                    <div className="mt-4 flex flex-wrap gap-4">
                        {studies.map(study => (
                            <StudyCard key={study.id} study={study} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
