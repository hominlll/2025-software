// src/components/PostItem.js
import React from "react";

export default function PostItem({ post }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">{post.title}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
          {post.category}
        </span>
      </div>
      <p className="text-gray-700 text-sm whitespace-pre-line">
        {post.content}
      </p>
    </div>
  );
}
