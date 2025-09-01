import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import Loading from "../../components/students/Loading";
import { assets,
  //  dummyDashboardData 
  } from "../../assets/assets";
import { FaHashtag, FaUser, FaBookOpen, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const Dashboard = () => {
  const { currency, backendUrl, getToken, isEducator,  } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    // setDashboardData(dummyDashboardData);
    try{
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }

    }catch(error){
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // fetchDashboardData();
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  return dashboardData ? (
    <div className="flex flex-col items-start justify-between min-h-screen gap-8 p-4 md:p-8 lg:p-12 bg-gray-50">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {/* Card 1 */}
        <div className="relative p-0.5 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:scale-105 transform transition duration-300 ease-in-out group animate-border">
          <div className="flex flex-col justify-between bg-white p-6 rounded-2xl h-full">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
              <img
                src={assets.patients_icon}
                alt="patients icon"
                className="w-10 h-10"
              />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.enrolledStudentsData?.length || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Enrollments</p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative p-0.5 rounded-2xl bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:scale-105 transform transition duration-300 ease-in-out group animate-border">
          <div className="flex flex-col justify-between bg-white p-6 rounded-2xl h-full">
            <div className="flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
              <img
                src={assets.appointments_icon}
                alt="appointments icon"
                className="w-10 h-10"
              />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {dashboardData.totalCourses || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Courses</p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative p-0.5 rounded-2xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 hover:scale-105 transform transition duration-300 ease-in-out group animate-border">
          <div className="flex flex-col justify-between bg-white p-6 rounded-2xl h-full">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-50 rounded-full mb-4">
              <img
                src={assets.earning_icon}
                alt="earning icon"
                className="w-10 h-10"
              />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {currency} {dashboardData.totalEarnings || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full mt-3">
        <h2 className="pb-4 text-xl font-bold text-gray-800">
          Latest Enrollments
        </h2>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr className="text-left text-gray-600 font-semibold text-sm">
                  <th className="text-center px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center justify-center gap-2">
                      <FaHashtag />
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FaUser /> <span>Student Name</span>
                    </div>
                  </th>
                  <th className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FaBookOpen /> <span>Course Title</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt /> <span>Enrollment Date</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dashboardData.enrolledStudentsData?.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="text-center px-4 py-3 hidden md:table-cell text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            item.student?.assets?.student_img
                              ? assets[item.student.assets.student_img]
                              : `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?...`
                          }
                          alt="student profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-800">
                          {item.studentName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {item.courseTitle}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm hidden lg:table-cell">
                      {item.enrollmentDate || "Jan 15, 2023"}
                    </td>
                  </tr>
                )) || null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes borderAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-border {
          background-size: 200% 200%;
          animation: borderAnimation 3s ease infinite;
        }
      `}</style>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
