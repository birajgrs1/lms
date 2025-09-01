import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  FiClock,
  FiBook,
  FiCheckCircle,
  FiPlayCircle,
  FiAward,
  FiBarChart2,
  FiUser
} from "react-icons/fi";
import { Line } from "rc-progress";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/students/Footer";
import { toast } from "react-toastify";
import axios from "axios";

const humanizer = humanizeDuration.humanizer({
  language: "en",
  units: ["h", "m"],
  round: true,
  spacer: " ",
  delimiter: ", ",
  largest: 2,
});

const MyEnrollments = () => {
  const navigate = useNavigate();
  const { 
    enrolledCourses, 
    calculateCourseDuration,  
    userData, 
    fetchUserEnrolledCourses, 
    backendUrl, 
    getToken, 
    calculateNoOfLectures 
  } = useContext(AppContext);

  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch progress for all enrolled courses
  const fetchAllProgress = async () => {
    if (!enrolledCourses || enrolledCourses.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      const progressPromises = enrolledCourses.map(async (course) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          return {
            courseId: course._id,
            progress: data.success ? data.progressData : null,
            error: !data.success
          };
        } catch (error) {
          console.error("Error fetching progress for course:", course._id, error);
          return {
            courseId: course._id,
            progress: null,
            error: true
          };
        }
      });

      const results = await Promise.all(progressPromises);
      
      // Convert array to object for easier access
      const progressObj = {};
      results.forEach(result => {
        progressObj[result.courseId] = {
          lectureCompleted: result.progress?.lectureCompleted || [],
          completed: result.progress?.completed || false,
          error: result.error
        };
      });
      
      setProgressData(progressObj);
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Failed to load course progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      setLoading(true);
      // Ensure we have the latest enrolled courses
      fetchUserEnrolledCourses().then(() => {
        // Progress will be fetched in the next useEffect
      });
    }
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses && enrolledCourses.length > 0) {
      fetchAllProgress();
    } else {
      setLoading(false);
    }
  }, [enrolledCourses]);

  const calculateProgress = (courseId) => {
    if (!progressData[courseId]) return 0;
    
    const totalLectures = calculateNoOfLectures
      ? calculateNoOfLectures(enrolledCourses.find(c => c._id === courseId))
      : 0;
      
    if (totalLectures === 0) return 0;
    
    const completedLectures = progressData[courseId].lectureCompleted.length;
    return (completedLectures / totalLectures) * 100;
  };

  const formatDuration = (course) => {
    if (!calculateCourseDuration) return "0 min";
    
    const minutes = calculateCourseDuration(course);
    const ms = minutes * 60 * 1000;
    return ms > 0 ? humanizer(ms) : "0 min";
  };

  const getEducatorName = (course) => {
    // Check if educator is stored as object or string
    if (typeof course.educator === 'object' && course.educator.name) {
      return course.educator.name;
    }
    return course.educator || "Unknown Educator";
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Enrollments</h1>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="flex items-center">
                  <div className="w-16 h-12 bg-gray-200 rounded-md"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Enrollments</h1>
            <p className="text-gray-600">Track your learning progress and continue your courses</p>
          </div>

          {enrolledCourses && enrolledCourses.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        <div className="flex items-center">
                          <FiBook className="mr-2" />
                          Course
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 hidden sm:table-cell">
                        <div className="flex items-center">
                          <FiClock className="mr-2" />
                          Duration
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 hidden md:table-cell">
                        <div className="flex items-center">
                          <FiBarChart2 className="mr-2" />
                          Progress
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        <div className="flex items-center">
                          <FiCheckCircle className="mr-2" />
                          Status
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        <div className="flex items-center">
                          <FiPlayCircle className="mr-2" />
                          Action
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {enrolledCourses.map((course) => {
                      const progress = calculateProgress(course._id);
                      const isCompleted = progress === 100;
                      const completedCount = progressData[course._id]?.lectureCompleted.length || 0;
                      const totalCount = calculateNoOfLectures ? calculateNoOfLectures(course) : 0;

                      return (
                        <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                          {/* Course */}
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                src={course.courseThumbnail}
                                alt={course.courseTitle}
                                className="w-16 h-12 object-cover rounded-md shadow-sm"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/64x48?text=No+Image";
                                }}
                              />

                              <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {course.courseTitle}
                                </h3>
                                <p className="text-xs text-gray-500 flex items-center mt-1">
                                  <FiUser className="mr-1" />
                                  {getEducatorName(course)}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Duration */}
                          <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">
                            <div className="flex items-center">
                              <FiClock className="mr-2 text-cyan-600" />
                              {formatDuration(course)}
                            </div>
                          </td>

                          {/* Progress */}
                          <td className="px-6 py-4 hidden md:table-cell w-64">
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>{completedCount} of {totalCount} lessons</span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <Line
                                percent={progress}
                                strokeWidth={4}
                                trailWidth={4}
                                strokeColor={isCompleted ? "#10B981" : "#06B6D4"}
                                trailColor="#E5E7EB"
                              />
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isCompleted
                                  ? "bg-green-100 text-green-800"
                                  : progress > 0
                                  ? "bg-cyan-100 text-cyan-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {isCompleted ? (
                                <>
                                  <FiCheckCircle className="mr-1" />
                                  Completed
                                </>
                              ) : progress > 0 ? (
                                <>
                                  <FiPlayCircle className="mr-1" />
                                  In Progress
                                </>
                              ) : (
                                <>
                                  <FiBook className="mr-1" />
                                  Not Started
                                </>
                              )}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => navigate("/player/" + course._id)}
                              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                                isCompleted
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                              } transition-colors`}
                            >
                              {isCompleted ? (
                                <>
                                  <FiAward className="mr-1.5" />
                                  Review
                                </>
                              ) : (
                                <>
                                  <FiPlayCircle className="mr-1.5" />
                                  Continue
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Empty State
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBook className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Enrollments Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                You haven't enrolled in any courses yet. Explore our catalog to
                find courses that match your interests.
              </p>
              <button
                onClick={() => navigate("/course-list")}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;