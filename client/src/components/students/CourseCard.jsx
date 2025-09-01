import { useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import AppContext from "../../context/AppContext";

const CourseCard = ({ course }) => {
  const { currency, calculateAverageRating } = useContext(AppContext);

  const discountedPrice =
    course.discount > 0
      ? course.coursePrice - (course.coursePrice * course.discount) / 100
      : course.coursePrice;

  // const rating = Math.min(5, Math.max(0, course.rating || 4.6));
  // const fullStars = Math.floor(rating);
  // const halfStar = rating % 1 >= 0.5;

  const rating = calculateAverageRating(course.courseRatings || []);
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100">
      <Link to={`/course/${course._id}`} onClick={() => window.scrollTo(0, 0)}>
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={course.courseThumbnail}
            alt={course.courseTitle}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {course.discount > 0 && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              {course.discount}% OFF
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-bold text-lg line-clamp-1">
              {course.courseTitle}
            </h3>
          </div>
        </div>
        {/* Educator */}
        <div className="flex items-center gap-2 p-4">
          <p className="text-sm font-medium text-gray-700">{course.educator.name}</p>
        </div>
        {/* Content */}
        <div className="p-5">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            <div className="flex">
              {[...Array(fullStars)].map((_, index) => (
                <img
                  key={`full-${index}`}
                  src={assets.star}
                  alt="star"
                  className="w-4 h-4"
                />
              ))}
              {halfStar && (
                <img
                  src={assets.star_half || assets.star} 
                  alt="half-star"
                  className="w-4 h-4"
                />
              )}
              {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map(
                (_, index) => (
                  <img
                    key={`empty-${index}`}
                    src={assets.star_empty || assets.star}
                    alt="empty-star"
                    className="w-4 h-4 opacity-30"
                  />
                )
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 ml-1">
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Price */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-800">
                {currency}
                {discountedPrice.toFixed(2)}
              </span>
              {course.discount > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  {currency}
                  {course.coursePrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;


