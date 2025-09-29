import "./MentorCard.css";

export default function MentorCard({ mentor }) {
  return (
    <div className="mentor-card">
      <img src={mentor.avatar} alt={mentor.name} className="mentor-img" />
      <div className="mentor-info">
        <h3>{mentor.name}</h3>
        <p>{mentor.title}</p>
        <span>{mentor.price}원 / 시간</span>
      </div>
    </div>
  );
}
