const MentorCard = ({ mentor }) => {
  return (
    <div className="w-85 bg-white shadow-md rounded-2xl p-4 hover:shadow-xl transition">
      <img 
        src={mentor.image} 
        alt={mentor.name} 
        className="w-full h-40 object-cover rounded-xl"
      />

      <h3 className="mt-3 text-lg font-semibold">{mentor.name}</h3>
      <p className="text-gray-600 text-sm">
        {mentor.position} / {mentor.experience}
      </p>

      <p className="mt-1 text-gray-500 text-sm">{mentor.company}</p>

      <p className="mt-2 font-medium text-yellow-500">
        ⭐ {mentor.rating} <span className="text-gray-500">({mentor.reviews}명)</span>
      </p>

      <p className="mt-1 font-semibold text-blue-600">
        ₩{mentor.price.toLocaleString()} / 1시간
      </p>

      <div className="flex flex-wrap gap-1 mt-3">
        {mentor.tags.split(',').map(tag => (
          <span 
            key={tag}
            className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MentorCard;
