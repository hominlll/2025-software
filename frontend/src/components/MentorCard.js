import React from 'react';

const MentorCard = ({ mentor }) => {
  return (
    <div style={{border:'1px solid #ccc', borderRadius:'10px', padding:'15px', width:'250px'}}>
      <img src={mentor.image} alt={mentor.name} style={{width:'100%', borderRadius:'10px'}}/>
      <h3>{mentor.name}</h3>
      <p>{mentor.position} / {mentor.experience}</p>
      <p>{mentor.company}</p>
      <p>⭐ {mentor.rating} ({mentor.reviews}명)</p>
      <p>₩{mentor.price.toLocaleString()} / 1시간</p>
      <div>
        {mentor.tags.split(',').map(tag => <span key={tag} style={{marginRight:'5px'}}>#{tag}</span>)}
      </div>
    </div>
  );
};

export default MentorCard;
