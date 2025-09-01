// CoursesSection.jsx
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";
import { useContext } from "react";
import AppContext from "../../context/AppContext";

const CoursesSection = () => {
  const { allCourses} = useContext(AppContext);

  return (
    <div className="py-16 px-4 sm:px-8 lg:px-16 xl:px-40 bg-gradient-to-b from-white to-cyan-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow">
            <span className="text-xs font-bold text-white tracking-wider uppercase">
              New Courses Added Weekly
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Train with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700">
              Industry Experts
            </span>
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Top-rated courses across every interest. Dive into coding, design,
            business, wellness, and more — and take the next step in your growth
            journey.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {allCourses.slice(0, 4).map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>

        {/* Explore More Button */}
        <div className="text-center">
          <Link
            to="/course-list"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
          >
            <span>Explore All Courses</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 
                1 0 010 1.414l-4 4a1 1 0 
                01-1.414-1.414L12.586 11H5a1 1 0 
                110-2h7.586l-2.293-2.293a1 1 0 
                010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoursesSection;
