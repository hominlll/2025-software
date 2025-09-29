import { useParams } from "react-router-dom";
import "./MentorDetail.css";

export default function MentorDetail() {
  const { id } = useParams();

  return (
    <div className="mentor-detail">
      <h2>멘토 상세 페이지</h2>
      <p>멘토 ID: {id}</p>
      <p>이 페이지에는 멘토의 상세 정보(프로필, 경력, 후기 등)가 들어갑니다.</p>
    </div>
  );
}
