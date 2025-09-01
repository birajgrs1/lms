import { useState, useContext, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
import Loading from "../../components/students/Loading";
import Rating from "../../components/students/Rating";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { PiCertificateBold } from "react-icons/pi";
import { RiInfinityLine } from "react-icons/ri";
import { MdMobileFriendly } from "react-icons/md";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import Footer from "../../components/students/Footer";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [progressData, setProgressData] = useState(null);

  const {
    calculateAverageRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
    userData,
    backendUrl,
    fetchUserData,
    getToken,
    updateCourseProgress,
    getCourseProgress,
  } = useContext(AppContext);

  const fetchCourseData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
      if (data.success) {
        const course = data.courseData || data.course;
        setCourseData(course);

        // Expand first chapter by default
        const initialExpanded = {};
        if (course.courseContent) {
          course.courseContent.forEach((_, index) => {
            initialExpanded[index] = index === 0;
          });
        }
        setExpandedChapters(initialExpanded);

        if (userData?.enrolledCourses) {
          const courseId = course._id;
          setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseId));
        }
        // Fetch progress for the course

        if (isAlreadyEnrolled && userData) {
          const courseId = course._id;
          const progress = await getCourseProgress(courseId);
          setProgressData(progress);
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, id, userData, isAlreadyEnrolled, getCourseProgress]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const toggleChapter = (index) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleEnrollClick = async () => {
    if (!userData) {
      toast.info("Please login to enroll in this course");
      return;
    }

    setEnrolling(true);
    try {
      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        if (courseData.coursePrice === 0) {
          setIsAlreadyEnrolled(true);
          toast.success("Successfully enrolled in the course!");
          if (fetchUserData) await fetchUserData();
        } else {
          window.location.replace(data.session_url);
        }
      } else {
        toast.error(data.message || "Enrollment failed");
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      toast.error(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const markLectureComplete = async (lectureId) => {
    if (!isAlreadyEnrolled || !userData) {
      toast.info("Please enroll in the course first");
      return;
    }

    try {
      const success = await updateCourseProgress(id, lectureId);
      if (success) {
        // Refresh progress data
        const updatedProgress = await getCourseProgress(id);
        setProgressData(updatedProgress);
        toast.success("Lecture marked as complete!");
      } else {
        toast.error("Failed to update progress");
      }
    } catch (error) {
      console.error("Error marking lecture complete:", error);
      toast.error("Failed to update progress");
    }
  };

  const isLectureCompleted = (lectureId) => {
    return progressData && progressData.lectureCompleted
      ? progressData.lectureCompleted.includes(lectureId)
      : false;
  };

  if (loading) return <Loading />;

  if (error || !courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The course you're looking for doesn't exist or may have been removed."}
          </p>
          <button
            onClick={() => navigate("/course-list")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  const ratings = courseData.courseRatings || [];
  const averageRating = calculateAverageRating
    ? calculateAverageRating(ratings)
    : 0;

  const totalMinutes = calculateCourseDuration
    ? calculateCourseDuration(courseData)
    : 0;
  const totalDuration = humanizeDuration(totalMinutes * 60 * 1000, {
    units: ["h", "m"],
    round: true,
  });

  const numberOfLectures = calculateNoOfLectures
    ? calculateNoOfLectures(courseData)
    : 0;

  return (
    <>
      <div className="min-h-screen bg-gray-50 mb-[16px] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                >
                  Home
                </button>
              </li>
              <li className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-500 text-sm font-medium truncate max-w-xs">
                  {courseData.courseTitle || "Untitled Course"}
                </span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 md:p-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                    {courseData.courseTitle || "Untitled Course"}
                  </h1>

                  {/* Ratings */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center">
                      <Rating
                        rating={averageRating}
                        size={20}
                        showNumber={true}
                        reviewCount={ratings.length}
                      />
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      {courseData.enrolledStudents?.length || 0} students
                      enrolled
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{totalDuration}</span>
                  </div>

                  {/* Description */}
                  <div className="prose max-w-none text-gray-600 mb-8">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          courseData.courseDescription ||
                          "No description available.",
                      }}
                    />
                  </div>

                  {/* Course Content */}
                  <div className="pt-6 text-gray-800">
                    <h2 className="text-xl font-semibold mb-6">
                      Course Content
                    </h2>
                    <div className="space-y-4">
                      {courseData.courseContent?.length > 0 ? (
                        courseData.courseContent.map((chapter, index) => {
                          const chapterMinutes = calculateChapterTime
                            ? calculateChapterTime(chapter)
                            : 0;
                          const chapterDuration = humanizeDuration(
                            chapterMinutes * 60 * 1000,
                            { units: ["h", "m"], round: true }
                          );

                          return (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                              <button
                                onClick={() => toggleChapter(index)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <img
                                    src={assets.down_arrow_icon}
                                    alt="toggle"
                                    className={`w-5 h-5 mt-1 transition-transform duration-200 ${
                                      expandedChapters[index]
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                  <div className="text-left">
                                    <p className="text-gray-800 font-medium text-base">
                                      {chapter.chapterTitle}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {chapter.chapterContent?.length || 0}{" "}
                                      lectures • {chapterDuration}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-gray-500 text-sm">
                                  {expandedChapters[index] ? "Hide" : "Show"}
                                </span>
                              </button>

                              {expandedChapters[index] && (
                                <div className="bg-white p-4 border-t border-gray-200">
                                  <ul className="space-y-3">
                                    {chapter.chapterContent?.map(
                                      (lecture, i) => {
                                        const lectureDuration =
                                          humanizeDuration(
                                            (lecture.lectureDuration || 0) *
                                              60 *
                                              1000,
                                            { units: ["m"], round: true }
                                          );

                                        // Get YouTube video ID
                                        const videoId = getYouTubeVideoId(
                                          lecture.lectureUrl
                                        );
                                        const completed = isLectureCompleted(
                                          lecture.lectureId
                                        );

                                        return (
                                          <li
                                            key={i}
                                            className="flex gap-3 items-start"
                                          >
                                            {isAlreadyEnrolled ? (
                                              <button
                                                onClick={() =>
                                                  markLectureComplete(
                                                    lecture.lectureId
                                                  )
                                                }
                                                className="mt-1.5 flex-shrink-0"
                                              >
                                                {completed ? (
                                                  <FiCheckCircle className="w-4 h-4 text-green-500" />
                                                ) : (
                                                  <FiCircle className="w-4 h-4 text-gray-400" />
                                                )}
                                              </button>
                                            ) : (
                                              <img
                                                src={assets.play_icon}
                                                alt="play"
                                                className="w-4 h-4 mt-1.5 flex-shrink-0"
                                              />
                                            )}
                                            <div className="flex-1">
                                              <p className="text-gray-700 font-medium text-sm">
                                                {lecture.lectureTitle}
                                                {completed && (
                                                  <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                                                    Completed
                                                  </span>
                                                )}
                                              </p>
                                              <div className="text-xs text-gray-500 flex gap-3 mt-1">
                                                {lecture.isPreviewFree &&
                                                  videoId && (
                                                    <span
                                                      onClick={() =>
                                                        setPlayerData({
                                                          videoId,
                                                        })
                                                      }
                                                      className="text-green-600 bg-green-100 px-2 py-0.5 rounded cursor-pointer"
                                                    >
                                                      Free Preview
                                                    </span>
                                                  )}
                                                <span>{lectureDuration}</span>
                                              </div>
                                            </div>
                                          </li>
                                        );
                                      }
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500 text-center py-8">
                          No chapters available.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Rating Component for enrolled students */}
                  {isAlreadyEnrolled && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <Rating
                        courseId={courseData._id}
                        userRating={ratings.find(
                          (r) => r.userId === userData?._id
                        )}
                        onRatingSubmit={fetchCourseData}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
                <div className="p-6">
                  {/* Thumbnail or Video Player */}
                  {playerData ? (
                    <YouTube
                      videoId={playerData.videoId}
                      opts={{
                        playerVars: {
                          autoplay: 1,
                          modestbranding: 1,
                          rel: 0,
                        },
                      }}
                      onError={(e) => {
                        console.error("YouTube Player Error:", e);
                        toast.error("Failed to load video preview");
                        setPlayerData(null);
                      }}
                      iframeClassName="w-full aspect-video rounded-lg"
                    />
                  ) : (
                    <div className="mb-6">
                      <img
                        src={courseData.courseThumbnail}
                        alt={courseData.courseTitle}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Progress for enrolled students */}
                  {isAlreadyEnrolled && progressData && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-800 mb-2">
                        Your Progress
                      </h3>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-cyan-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (progressData.lectureCompleted?.length /
                                numberOfLectures) *
                                100 || 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600">
                        {progressData.lectureCompleted?.length || 0} of{" "}
                        {numberOfLectures} lessons completed
                      </p>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mb-6">
                    {courseData.discount > 0 ? (
                      <>
                        <span className="text-2xl font-bold text-gray-800">
                          {currency}
                          {(
                            courseData.coursePrice -
                            (courseData.coursePrice * courseData.discount) / 100
                          ).toFixed(2)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          {currency}
                          {courseData.coursePrice.toFixed(2)}
                        </span>
                        <span className="ml-2 px-2 py-1 bg-amber-400 text-gray-900 text-xs font-bold rounded">
                          {courseData.discount}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-gray-800">
                        {currency}
                        {courseData.coursePrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Enroll Button */}
                  <button
                    className={`w-full py-3 text-white font-bold rounded-lg transition-opacity mb-4 ${
                      isAlreadyEnrolled
                        ? "bg-green-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
                    }`}
                    onClick={handleEnrollClick}
                    disabled={isAlreadyEnrolled || enrolling}
                  >
                    {isAlreadyEnrolled
                      ? "Already Enrolled"
                      : enrolling
                      ? "Enrolling..."
                      : "Enroll Now"}
                  </button>

                  {/* Course Features */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <AiOutlineVideoCamera className="w-5 h-5 mr-2 text-red-500" />
                      <span className="font-medium">
                        {numberOfLectures} lectures
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-700">
                      <PiCertificateBold className="w-5 h-5 mr-2 text-green-600" />
                      <span className="font-medium">
                        Certificate of completion
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-700">
                      <RiInfinityLine className="w-5 h-5 mr-2 text-purple-500" />
                      <span className="font-medium">Lifetime access</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-700">
                      <MdMobileFriendly className="w-5 h-5 mr-2 text-indigo-500" />
                      <span className="font-medium">Access on mobile & TV</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;
