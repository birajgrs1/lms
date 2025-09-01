import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import SearchBar from "../../components/students/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/students/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/students/Footer";

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      let tempCourses = [...allCourses];

      if (input) {
        tempCourses = tempCourses.filter((item) =>
          item.courseTitle.toLowerCase().includes(input.toLowerCase())
        );
      }

      if (selectedCategory !== "All") {
        tempCourses = tempCourses.filter(
          (item) => item.category === selectedCategory
        );
      }

      switch (sortBy) {
        case "price-low":
          tempCourses.sort((a, b) => a.coursePrice - b.coursePrice);
          break;
        case "price-high":
          tempCourses.sort((a, b) => b.coursePrice - a.coursePrice);
          break;
        case "rating":
          tempCourses.sort((a, b) => b.rating - a.rating);
          break;
        default:
          tempCourses.sort((a, b) => b.enrollments - a.enrollments);
      }

      setFilteredCourses(tempCourses);
    }
  }, [allCourses, input, selectedCategory, sortBy]);

  const categories = [
    "All",
    "Development",
    "Design",
    "Business",
    "Marketing",
    "Lifestyle",
  ];

  return (
    <>
      <div className="min-h-screen pt-14 pb-16">
        <div className="py-10 px-4 sm:px-8 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Discover Courses
                </h1>
                <div className="flex items-center mt-2 text-sm text-gray-500 space-x-2">
                  <span
                    className="cursor-pointer hover:text-cyan-600"
                    onClick={() => navigate("/")}
                  >
                    Home
                  </span>
                  <span>/</span>
                  <span>Course List</span>
                  {input && (
                    <>
                      <span>/</span>
                      <span className="text-cyan-600 font-medium">
                        Search: "{input}"
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="w-full md:w-auto">
                <SearchBar data={input} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
          <div className="p-6 rounded-lg border shadow-sm bg-white mb-10">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              {/* Category Filter */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Filter by Category
                </h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        selectedCategory === category
                          ? "bg-cyan-600 text-white shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Sort by
                </h2>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                >
                  <option value="popularity">Popularity</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Course Count & Grid */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 text-sm sm:text-base">
              Showing{" "}
              <span className="font-semibold">{filteredCourses.length}</span>{" "}
              course{filteredCourses.length !== 1 ? "s" : ""}
              {input && ` for "${input}"`}
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </p>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>
          ) : (
            <div className="bg-white border shadow-sm rounded-lg p-12 text-center">
              <img
                src={assets.no_courses}
                alt="No courses found"
                className="w-44 h-44 mx-auto mb-6 opacity-70"
              />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                No courses found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm">
                {input
                  ? `We couldn't find any courses matching "${input}". Try adjusting your search terms.`
                  : "There are no courses available in this category at the moment."}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  navigate("/course-list");
                }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Browse All Courses
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;
