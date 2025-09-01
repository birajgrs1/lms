import { useContext, useEffect, useState } from "react";
import { 
  // dummyStudentEnrolled, 
  assets } from "../../assets/assets";
import Loading from "../../components/students/Loading";
import { FaHashtag, FaUser, FaBookOpen, FaCalendarAlt } from "react-icons/fa";
import AppContext from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const StudentsEnrolled = () => {

  const {backendUrl, getToken, isEducator} = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    // setEnrolledStudents(dummyStudentEnrolled);
    try{
    const token = await getToken();
    const {data} = await axios.get(`${backendUrl}/api/educator/enrolled-students`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if(data.success){
      setEnrolledStudents(data.enrolledStudents.reverse());
    }
    else{
      toast.error(data.message);
    }

    }catch(error){
      toast.message(error);
    }
  };

  useEffect(() => {
    // fetchEnrolledStudents();
    if(isEducator){
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  return enrolledStudents ? (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm md:text-base">
              <tr>
                <th className="text-center px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center justify-center gap-2">
                    <FaHashtag /> 
                  </div>
                </th>
                <th className="font-semibold px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FaUser />
                   Student Name
                  </div>
                </th>
                <th className="font-semibold px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FaBookOpen /> Course Title
                  </div>
                </th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">
                  <div className="flex items-center justify-center gap-2">
                    <FaCalendarAlt /> Date Joined
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm md:text-base">
              {enrolledStudents.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Index */}
                  <td className="text-center px-4 py-3 hidden md:table-cell text-gray-500">
                    {index + 1}
                  </td>

                  {/* Student */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={
                          item.student?.assets?.student_img
                            ? assets[item.student.assets.student_img]
                            : `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?...`
                        }
                        alt="student profile"
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      />
                      <span className="font-medium text-gray-800 truncate max-w-[140px] md:max-w-[200px]">

                        {item.student.fullName}                    
                          </span>
                    </div>
                  </td>

                  {/* Course Title */}
                  <td className="px-4 py-3 text-gray-700 truncate max-w-[160px] md:max-w-xs">
                    {item.courseTitle}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-gray-500 text-sm hidden lg:table-cell text-center">
                    {new Date(item.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="mt-6 md:hidden grid grid-cols-1 gap-4">
        {enrolledStudents.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={
                  item.student?.assets?.student_img
                    ? assets[item.student.assets.student_img]
                    : `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?...`
                }
                alt="student profile"
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              <div>
                <h3 className="font-medium text-gray-800 flex items-center gap-2">
                  <FaUser className="text-gray-600" /> {item.studentName}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <FaBookOpen className="text-blue-600" /> {item.courseTitle}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span className="font-medium flex items-center gap-1">
                <FaCalendarAlt className="text-gray-500" /> Date Joined:
              </span>
              <span className="text-gray-500">
                {new Date(item.purchaseDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;
