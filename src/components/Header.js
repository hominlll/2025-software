import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">MyMentoring</div>
      <nav className="nav">
        <a href="/">홈</a>
        <a href="/mentors">멘토 찾기</a>
        <a href="/about">소개</a>
      </nav>
    </header>
  );
}
