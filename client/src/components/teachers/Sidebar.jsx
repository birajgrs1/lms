import { useContext } from "react";
import { assets } from "../../assets/assets";
import AppContext from "../../context/AppContext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/educator",
      icon: assets.home_icon,
    },
    {
      name: "Add Course",
      path: "/educator/add-course",
      icon: assets.add_icon,
    },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: assets.my_course_icon,
    },
    {
      name: "Students Enrolled",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
    },
  ];

  return (
    isEducator && (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white w-64 border-r border-gray-200 shadow-sm">
        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/educator"}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-cyan-50 hover:text-cyan-700"
                }`
              }
            >
              <div
                className={`p-2 rounded-lg ${
                  item.path === "/educator" ? "bg-white/20" : "bg-gray-100 group-hover:bg-cyan-100"
                }`}
              >
                <img src={item.icon} alt={item.name} className="w-5 h-5" />
              </div>
              <span className="ml-3 font-medium">{item.name}</span>

              {/* Active state indicator */}
              {({ isActive }) =>
                isActive ? <div className="ml-auto w-2 h-2 bg-white rounded-full"></div> : null
              }
            </NavLink>
          ))}
        </nav>
      </div>
    )
  );
};

export default Sidebar;
