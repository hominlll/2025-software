// src/components/PostList.js
import React from "react";
import PostItem from "./PostItem";

export default function PostList({ posts }) {
  return (
    <div className="mt-6 space-y-4">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          등록된 게시글이 없습니다.
        </p>
      ) : (
        posts.map((post, idx) => <PostItem key={idx} post={post} />)
      )}
    </div>
  );
}
