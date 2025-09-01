// AppContextProvider.jsx
import { useEffect, useState } from "react";
import AppContext from "./AppContext";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  const backendUrl = import.meta.env.PROD
    ? import.meta.env.VITE_BACKEND_URL_PROD
    : import.meta.env.VITE_BACKEND_URL;
  const { getToken } = useAuth();
  const { user } = useUser();

  // fetch all courses from API
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/all`);

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error(error.message);
    }
  };

  // Fetch user data from API
  const fetchUserData = async () => {
    if (
      user &&
      user.publicMetadata &&
      user.publicMetadata.role === "educator"
    ) {
      setIsEducator(true);
    }
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(error.message);
    }
  };

  // Function to calculate average rating for a course
  const calculateAverageRating = (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    const totalRating = reviews.reduce(
      (acc, review) => acc + (review.rating || 0),
      0
    );
    return Math.floor(totalRating / reviews.length);
  };

  // Function to calculate chapter time in minutes (returns number)
  const calculateChapterTime = (chapter) => {
    if (!chapter || !chapter.chapterContent) return 0;
    return chapter.chapterContent.reduce(
      (total, lecture) => total + (lecture.lectureDuration || 0),
      0
    );
  };

  // Function to calculate the course duration in minutes (returns number)
  const calculateCourseDuration = (course) => {
    if (!course || !course.courseContent) return 0;
    return course.courseContent.reduce(
      (total, chapter) => total + calculateChapterTime(chapter),
      0
    );
  };

  // Function to calculate no of lectures in the course
  const calculateNoOfLectures = (course) => {
    if (!course || !course.courseContent) return 0;
    return course.courseContent.reduce(
      (total, chapter) => total + (chapter.chapterContent?.length || 0),
      0
    );
  };

  // Fetch User Enrolled Courses from API
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/user/enrolled-courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      toast.error(error.message);
    }
  };

  // Purchase course API call - ADD THIS MISSING FUNCTION
  const purchaseCourse = async (courseId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        // Refresh enrolled courses after successful purchase
        await fetchUserEnrolledCourses();
        return data.session_url;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      console.error("Error purchasing course:", error);
      toast.error(error.response?.data?.message || "Purchase failed");
      return null;
    }
  };

  // Add rating to course API call
  const addCourseRating = async (courseId, rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Rating added successfully!");
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error("Error adding rating:", error);
      toast.error(error.response?.data?.message || "Failed to add rating");
      return false;
    }
  };

  // Update user course progress API call
  const updateCourseProgress = async (courseId, lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        return true;
      } else {
        console.error("Progress update failed:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      return false;
    }
  };

  // Get user course progress API call
  const getCourseProgress = async (courseId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        return data.progressData;
      } else {
        console.error("Progress fetch failed:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user]);

  const value = {
    currency,
    allCourses,
    calculateAverageRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchAllCourses,
    fetchUserEnrolledCourses,
    userData,
    fetchUserData,
    backendUrl,
    setUserData,
    getToken,
    user,
    // API functions
    purchaseCourse,
    addCourseRating,
    updateCourseProgress,
    getCourseProgress,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
