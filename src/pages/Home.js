import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <h1>나만의 멘토를 찾아보세요</h1>
      <p>개발, 디자인, 취업 준비까지 다양한 분야의 전문가 멘토들이 기다리고 있습니다.</p>
      <a href="/mentors" className="btn">멘토 보러 가기</a>
    </div>
  );
}
