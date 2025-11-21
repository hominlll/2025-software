import React, { useEffect, useState } from "react";
import axios from "axios";
import MentorCard from "./MentorCard";

const MentorSection = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/mentors")
      .then((res) => setMentors(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="px-10 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-8">
  {mentors.map((mentor) => (
    <MentorCard key={mentor.id} mentor={mentor} />
  ))}
</div>
  );
};

export default MentorSection;
