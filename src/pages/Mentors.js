import MentorCard from "../components/MentorCard";
import "./Mentors.css";

const dummyMentors = [
  {
    id: 1,
    name: "홍길동",
    title: "프론트엔드 개발자",
    price: 30000,
    avatar: "https://via.placeholder.com/400x300",
  },
  {
    id: 2,
    name: "이영희",
    title: "백엔드 개발자",
    price: 40000,
    avatar: "https://via.placeholder.com/400x300",
  },
  {
    id: 3,
    name: "김철수",
    title: "데이터 엔지니어",
    price: 35000,
    avatar: "https://via.placeholder.com/400x300",
  },
];

export default function Mentors() {
  return (
    <div className="mentors">
      {dummyMentors.map((m) => (
        <MentorCard key={m.id} mentor={m} />
      ))}
    </div>
  );
}
