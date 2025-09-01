import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
import Loading from "../../components/students/Loading";
import YouTube from "react-youtube";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/students/Footer";
import Rating from "../../components/students/Rating";
import {
  FaPlay,
  FaCheckCircle,
  FaRegCircle,
  FaChevronDown,
  FaChevronUp,
  FaClock,
  FaArrowLeft,
  FaBars,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const Player = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    enrolledCourses,
    getToken,
    useData,
    fetchUserEnrolledCourses,
    backendUrl,
  } = useContext(AppContext);

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // progressData is now being used to show course progress
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  // Function to get course data from enrolled courses
  const getCourseData = () => {
    const course = enrolledCourses.find(course => course._id === courseId);
    if (course) {
      setCourseData(course);
      
      // Set user's rating if exists
      const userRating = course.courseRatings?.find(
        rating => rating.userId === useData._id
      );
      if (userRating) {
        setInitialRating(userRating.rating);
      }
      
      // Expand first chapter by default
      const initExpanded = {};
      course.courseContent?.forEach((_, idx) => {
        initExpanded[idx] = idx === 0;
      });
      setExpandedChapters(initExpanded);

      // Pick first available lecture as default
      let firstLecture = null;
      for (const chapter of course.courseContent || []) {
        if (chapter.chapterContent && chapter.chapterContent.length > 0) {
          firstLecture = chapter.chapterContent[0];
          break;
        }
      }

      if (!firstLecture) {
        setError("No lectures available in this course");
        setLoading(false);
        return;
      }

      setCurrentLecture(firstLecture);
      setLoading(false);
    } else {
      setError("Course not found in your enrolled courses");
      setLoading(false);
    }
  };

  // Function to get course progress from API
  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/user/course-progress/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        setProgressData(data.progressData);
        // Set completed lectures from API response
        if (data.progressData.completedLectures) {
          setCompletedLectures(new Set(data.progressData.completedLectures));
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching course progress:", error);
      toast.error("Failed to load course progress");
    }
  };

  // Function to mark lecture as completed
  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        toast.success(data.message);
        // Update local state
        setCompletedLectures(prev => new Set([...prev, lectureId]));
        // Refresh progress data
        getCourseProgress();
        // Refresh enrolled courses to update progress
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error marking lecture as completed:", error);
      toast.error(error.response?.data?.message || "Failed to update progress");
    }
  };

  // Function to handle rating submission
  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        toast.success(data.message);
        // Refresh course data to show updated rating
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error(error.response?.data?.message || "Failed to submit rating");
    }
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
      getCourseProgress();
    }
  }, [enrolledCourses, courseId]);

  const toggleChapter = (idx) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleLectureSelect = (lecture) => {
    setCurrentLecture(lecture);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  /*
  //  Using allCourses instead of enrolledCourses
  useEffect(() => {
    if (!allCourses) {
      setError("Courses data not available");
      setLoading(false);
      return;
    }

    setLoading(true);
    const course = allCourses.find((c) => c._id === courseId);

    if (!course) {
      setError("Course not found");
      setLoading(false);
      return;
    }

    setCourseData(course);

    // Expand first chapter by default
    const initExpanded = {};
    course.courseContent?.forEach((_, idx) => {
      initExpanded[idx] = idx === 0;
    });
    setExpandedChapters(initExpanded);

    // Pick first available lecture as default
    let firstLecture = null;
    for (const chapter of course.courseContent || []) {
      if (chapter.chapterContent && chapter.chapterContent.length > 0) {
        firstLecture = chapter.chapterContent[0];
        break;
      }
    }

    if (!firstLecture) {
      setError("No lectures available in this course");
      setLoading(false);
      return;
    }

    setCurrentLecture(firstLecture);
    setLoading(false);
  }, [allCourses, courseId]);
  */

  /*
  // Local state toggle for completion (replaced with API call)
  const toggleCompletion = (lectureId) => {
    setCompletedLectures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lectureId)) {
        newSet.delete(lectureId);
      } else {
        newSet.add(lectureId);
      }
      return newSet;
    });
  };
  */

  /*
  //  Incomplete markLectureAsCompleted function
  const markLectureAsCompleted = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    }
     catch (error) {
      toast.error(error.message);
    }
  };
  */

  /*
  // Incomplete getCourseProgress function
  const getCourseProgress = async () =>{
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/course-progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  */

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20">
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
          <button
            onClick={() => navigate("/course-list")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-md"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 pt-16">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <button
            onClick={() => navigate("/course-list")}
            className="flex items-center text-blue-600 font-medium"
          >
            <FaArrowLeft className="mr-2" /> Back to Courses
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center"
          >
            <FaBars className="mr-2" /> {sidebarOpen ? "Hide" : "Contents"}
          </button>
        </div>

        {/* Sidebar for course structure */}
        <aside
          className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 transform transition-transform duration-300 fixed md:static inset-y-0 left-0 z-10 pt-16 md:pt-0 overflow-y-auto ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Course Content
              </h2>
              <button
                onClick={() => navigate("/course-list")}
                className="hidden md:flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <FaArrowLeft className="mr-1" /> All Courses
              </button>
            </div>

            {/* Course progress display using progressData */}
            {progressData && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Course Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${progressData.progressPercentage || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  {progressData.completedLecturesCount || 0} of {progressData.totalLecturesCount || 0} lectures completed
                  {progressData.progressPercentage && ` (${Math.round(progressData.progressPercentage)}%)`}
                </p>
              </div>
            )}

            {courseData.courseContent && courseData.courseContent.length > 0 ? (
              <div className="space-y-4">
                {courseData.courseContent.map((chapter, idx) => (
                  <div
                    key={chapter.chapterId}
                    className="rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <button
                      onClick={() => toggleChapter(idx)}
                      className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 font-medium flex justify-between items-center"
                    >
                      <span className="font-semibold text-gray-800">
                        {chapter.chapterTitle}
                      </span>
                      {expandedChapters[idx] ? (
                        <FaChevronUp className="text-gray-500" />
                      ) : (
                        <FaChevronDown className="text-gray-500" />
                      )}
                    </button>
                    {expandedChapters[idx] && (
                      <div className="bg-gray-50 p-2">
                        {chapter.chapterContent.map((lecture) => (
                          <div
                            key={lecture.lectureId}
                            className={`mb-1 rounded-md transition-all ${
                              currentLecture?.lectureId === lecture.lectureId
                                ? "bg-blue-100 border border-blue-200"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <button
                              onClick={() => handleLectureSelect(lecture)}
                              className="w-full text-left p-3 flex items-start"
                            >
                              <div className="mr-3 mt-1 text-blue-600">
                                {completedLectures.has(lecture.lectureId) ? (
                                  <FaCheckCircle className="text-green-500" />
                                ) : (
                                  <FaRegCircle className="text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span
                                    className={`font-medium ${
                                      currentLecture?.lectureId ===
                                      lecture.lectureId
                                        ? "text-blue-700"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {lecture.lectureTitle}
                                  </span>
                                  {lecture.lectureUrl && (
                                    <span className="ml-2 text-blue-600 text-xs font-bold bg-blue-100 px-2 py-1 rounded-full flex items-center">
                                      <FaPlay className="mr-1 text-xs" /> Watch
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center mt-1 text-xs text-gray-500">
                                  <FaClock className="mr-1" />
                                  {humanizeDuration(
                                    lecture.lectureDuration * 60 * 1000,
                                    {
                                      units: ["h", "m"],
                                      round: true,
                                    }
                                  )}
                                </div>
                              </div>
                            </button>
                            <div className="px-4 pb-2 pt-0">
                              <button
                                onClick={() => markLectureAsCompleted(lecture.lectureId)}
                                className={`text-xs px-3 py-1 rounded-full ${
                                  completedLectures.has(lecture.lectureId)
                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                              >
                                {completedLectures.has(lecture.lectureId)
                                  ? "Completed"
                                  : "Mark Complete"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No chapters available.</p>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Rate this course</h3>
              <Rating 
                initialRating={initialRating} 
                onRate={handleRate}
              />
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {courseData.courseTitle}
            </h1>

            {currentLecture ? (
              <>
                {/* Fixed YouTube player with proper aspect ratio */}
                <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden shadow-md mb-6">
                  {" "}
                  {/* 16:9 aspect ratio */}
                  <div className="absolute top-0 left-0 w-full h-full">
                    <YouTube
                      videoId={currentLecture.lectureUrl.split("/").pop()}
                      opts={{
                        width: "100%",
                        height: "100%",
                        playerVars: {
                          autoplay: 1,
                          modestbranding: 1,
                          rel: 0,
                        },
                      }}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                      {currentLecture.lectureTitle}
                    </h2>
                    <p className="text-gray-600 mt-2 flex items-center">
                      <FaClock className="mr-2" />
                      Duration:{" "}
                      {humanizeDuration(
                        currentLecture.lectureDuration * 60 * 1000,
                        {
                          units: ["h", "m", "s"],
                          round: true,
                        }
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => markLectureAsCompleted(currentLecture.lectureId)}
                    className={`px-4 py-2 rounded-lg flex items-center self-start md:self-auto ${
                      completedLectures.has(currentLecture.lectureId)
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }`}
                  >
                    {completedLectures.has(currentLecture.lectureId) ? (
                      <>
                        <FaCheckCircle className="mr-2" /> Completed
                      </>
                    ) : (
                      <>
                        <FaRegCircle className="mr-2" /> Mark Complete
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Select a lecture to begin
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Player;