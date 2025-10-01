import React, { useEffect, useState } from 'react';
import MentorCard from './MentorCard';
import axios from 'axios';

const MentorSection = () => {
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/mentors')
      .then(res => setMentors(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{display:'flex', gap:'20px', padding:'20px 50px', flexWrap:'wrap'}}>
      {mentors.map(mentor => <MentorCard key={mentor.id} mentor={mentor} />)}
    </div>
  );
};

export default MentorSection;
