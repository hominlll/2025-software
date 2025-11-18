// src/components/PostList.js
import React from "react";
import PostItem from "./PostItem";

export default function PostList({ posts, onPostClick }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="mt-6 space-y-4">
        <p className="text-center text-gray-500 py-10">
          등록된 게시글이 없습니다.
        </p>
      </div>
    );
  }

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="mt-6 space-y-4">
      {sortedPosts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onClick={onPostClick}   // ★ 여기!
        />
      ))}
    </div>
  );
}
