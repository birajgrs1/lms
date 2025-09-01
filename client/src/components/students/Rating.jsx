import { useEffect, useState } from "react";

const Rating = ({ initialRating = 0, onRate }) => {
  const [rating, setRating] = useState(initialRating); // Corrected useState to properly manage state

  const handleRatingClick = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  useEffect(() => {
    if (initialRating !== rating) { 
      setRating(initialRating);
    }
  }, [initialRating, rating]);

  return (
    <div>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1; 
        return (
          <span
            key={index}
            onClick={() => handleRatingClick(starValue)}
            className={`text-xl sm:text-2xl cursor-pointer transition-colors  ${
              starValue <= rating ? "text-yellow-500" : "text-gray-400"
            }`}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
