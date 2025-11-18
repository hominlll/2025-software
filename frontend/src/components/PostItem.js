// src/components/PostItem.js
import React from "react";
import { useNavigate } from "react-router-dom";

const formatDateTime = (createdAt) => {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${month}월 ${day}일 ${hour}:${minute}`;
};

export default function PostItem({ post }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // ★ /community/아이디 로 이동, post 데이터를 state로 같이 넘김
    navigate(`/community/${post.id}`, { state: { post } });
  };

  return (
    <div
      className="border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-lg">{post.title}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
          {post.category}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-2">
        {formatDateTime(post.createdAt)}
      </p>
      <p className="text-gray-700 text-sm whitespace-pre-line">
        {post.content}
      </p>
    </div>
  );
}
