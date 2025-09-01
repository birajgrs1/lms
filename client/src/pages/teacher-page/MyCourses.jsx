import AppContext from "../../context/AppContext";
import { useContext, useEffect, useState } from "react";
import Loading from "../../components/students/Loading";
import { FaBook, FaMoneyBillWave, FaUserGraduate, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const MyCourses = () => {
  const { currency,
    isEducator, 
    backendUrl,
    getToken
    // , allCourses
   } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    // setCourses(allCourses);
    try{
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/educator/courses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
   data.success && setCourses(data.courses);

    }catch(error){
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // fetchEducatorCourses();
    if(isEducator) fetchEducatorCourses();
  }, [isEducator]);

  // Function to calculate earnings for a course
  const calculateEarnings = (course) => {
    const price = parseFloat(course.coursePrice) || 0;
    const discount = parseFloat(course.courseDiscount) || 0;
    const students = course.enrolledStudents ? course.enrolledStudents.length : 0;

    // Calculate discounted price
    const discountedPrice = price - price * (discount / 100);

    // Calculate total earnings
    return students * discountedPrice;
  };

  return courses ? (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="w-full mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 pb-2 mb-3 md:mb-4 border-gray-200">
          My Courses
        </h2>
      </div>

      <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left text-gray-700">
                <th className="font-semibold px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FaBook /> Course
                  </div>
                </th>
                <th className="font-semibold px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave /> Earnings
                  </div>
                </th>
                <th className="font-semibold px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FaUserGraduate /> Students
                  </div>
                </th>
                <th className="font-semibold px-4 py-3 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt /> Published On
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map((course) => {
                const earnings = calculateEarnings(course);

                return (
                  <tr
                    key={course._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="flex items-center space-x-3 px-4 py-3">
                      <img
                        src={course.courseThumbnail}
                        alt="Thumbnail"
                        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                      />
                      <span className="font-medium text-gray-800 truncate max-w-xs">
                        {course.courseTitle}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                         {currency}{" "}
                        {earnings.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {course.enrolledStudents.length} students
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="mt-6 md:hidden grid grid-cols-1 gap-4">
        {courses.map((course) => {
          const earnings = calculateEarnings(course);

          return (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={course.courseThumbnail}
                  alt="Thumbnail"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                 {course.courseTitle}
                  </h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      Earnings:
                    </span>
                    <span className="text-green-600 font-medium">
                      {currency} {earnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                       Students:
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {course.enrolledStudents.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                       Published On:
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
