import React, { useEffect, useState } from "react";
import axios from "axios";
import MentorCard from "./MentorCard";

const MentorSection = ({ selectedCategory, searchText }) => {
  const [mentors, setMentors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("latest");

  const [tagSearch, setTagSearch] = useState("");
  const [isTagSearch, setIsTagSearch] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      const res = await axios.get("http://localhost:5000/api/mentors", {
        params: {
          category: selectedCategory,
          search: isTagSearch ? tagSearch : searchText,
          isTag: isTagSearch,
          sort,
          page,
          limit: 20,
        },
      });

      setMentors(res.data.mentors);
      setTotalPages(res.data.totalPages);
    };

    fetchMentors();
  }, [selectedCategory, searchText, tagSearch, isTagSearch, sort, page]);

  // 🔥 SearchBar 검색 시 태그 검색 해제
  useEffect(() => {
    if (searchText) {
      setIsTagSearch(false);
      setTagSearch("");
      setPage(1);
    }
  }, [searchText]);

  const handleTagClick = (tag) => {
    setTagSearch(tag);
    setIsTagSearch(true);
    setPage(1);
  };

  return (
    <div className="px-10 py-8">
      {/* 정렬 */}
      <div className="flex justify-end mb-6">
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="latest">최신순</option>
          <option value="oldest">등록순</option>
          <option value="rating">평점순</option>
          <option value="reviews">리뷰 많은 순</option>
        </select>
      </div>

      {/* 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {mentors.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">
            검색 결과가 없습니다.
          </p>
        ) : (
          mentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onTagClick={handleTagClick}
            />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-10 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded-md text-sm ${page === i + 1
                ? "bg-emerald-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MentorSection;
