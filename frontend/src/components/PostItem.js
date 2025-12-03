// src/components/PostItem.js
import React from "react";
import { useNavigate } from "react-router-dom";

const formatDateTime = (createdAt) => {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).toString().padStart(2, "0");
  const minute = String(d.getMinutes()).toString().padStart(2, "0");
  return `${month}월 ${day}일 ${hour}:${minute}`;
};

export default function PostItem({ post }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/community/${post.id}`, { state: { post } });
  };

  return (
    <div
      className="border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-50"
      onClick={handleClick}
    >
      <div className="mb-2">
        <span className="inline-block text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 mb-[12px]">
          {post.category}
        </span>
        <h3 className="font-semibold text-lg">{post.title}</h3>
      </div>

      <p className="text-gray-700 text-sm whitespace-pre-line mb-3">
        {post.content}
      </p>
      <p className="text-xs text-gray-400 mb-2">
        {formatDateTime(post.createdAt)}
      </p>
    </div>
  );
}

