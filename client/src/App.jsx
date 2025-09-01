import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/student-page/Home.jsx";
import CoursesList from "./pages/student-page/CoursesList.jsx";
import CourseDetails from "./pages/student-page/CourseDetails.jsx";
import MyEnrollments from "./pages/student-page/MyEnrollments.jsx";
import Player from "./pages/student-page/Player.jsx";
import Loading from "./components/students/Loading.jsx";

import Educator from "./pages/teacher-page/Educator.jsx";
import Dashboard from "./pages/teacher-page/Dashboard.jsx";
import AddCourse from "./pages/teacher-page/AddCourse.jsx";
import MyCourses from "./pages/teacher-page/MyCourses.jsx";
import StudentsEnrolled from "./pages/teacher-page/StudentsEnrolled.jsx";
import Navbar from "./components/students/Navbar.jsx";

import {ToastContainer} from "react-toastify";




const App = () => {
  const location = useLocation();
  const isEducatorRoute = location.pathname.startsWith("/educator");

  return (
    <div className="bg-white text-default min-h-screen">
      <ToastContainer />
      {/* Navbar for student routes */}
      {!isEducatorRoute && <Navbar />}

      <div className={!isEducatorRoute ? "pt-20" : ""}>
        <Routes>
          {/* Student routes */}
          <Route path="/" element={<Home />} />
          <Route path="/course-list" element={<CoursesList />} />
          <Route path="/course-list/:input" element={<CoursesList />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/my-enrollments" element={<MyEnrollments />} />
          <Route path="/player/:courseId/" element={<Player />} />
          <Route path="/loading/:path" element={<Loading />} />

          {/* Educator routes */}
          <Route path="/educator" element={<Educator />}>
            <Route index element={<Dashboard />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="student-enrolled" element={<StudentsEnrolled />} />
          </Route>
        </Routes>
      </div>
      
    </div>
  );
};

export default App;
