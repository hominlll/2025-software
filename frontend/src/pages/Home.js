import React, { useState, useEffect } from "react";
import MentorBanner from "../components/MentorBanner";
import StudyBanner from "../components/StudyBanner";
import MentorSection from "../components/MentorSection";
import StudyCreateModal from "../components/StudyCreateModal";
import StudyCard from "../components/StudyCard";
import CategoryBar from "../components/CategoryBar";

const Home = ({ selectedTab, userNickname }) => {
    const [showStudyModal, setShowStudyModal] = useState(false);
    const [studies, setStudies] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("전체");

    useEffect(() => {
        if (selectedTab === "study") {
            fetch("http://localhost:5000/api/study")
                .then(res => res.json())
                .then(data => setStudies(data))
                .catch(err => console.error(err));
        }
    }, [selectedTab]);

    const handleStudySubmit = async (newStudy) => {
        try {
            const studyToSend = { ...newStudy, maxPeople: Number(newStudy.maxPeople) };

            const res = await fetch("http://localhost:5000/api/study", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(studyToSend),
            });

            const data = await res.json();

            if (data.success) {
                alert("스터디 등록 성공!");
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

            {selectedTab === "mentoring" && (
                <>
                    <MentorBanner userNickname={userNickname} />

                    <div className="px-10 mt-4">
                        <CategoryBar
                            selected={selectedCategory}
                            setSelected={(c) => setSelectedCategory(c.trim())}
                        />
                    </div>

                    <MentorSection selectedCategory={selectedCategory} />
                </>
            )}

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

                    <div className="mt-4 flex flex-wrap gap-4 px-10">
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
