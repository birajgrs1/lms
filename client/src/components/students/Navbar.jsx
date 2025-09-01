import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import AppContext from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-list");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const { isEducator, setIsEducator, backendUrl, getToken } = useContext(AppContext);

  const becomeEducator = async (e) => {
    if (e) e.preventDefault();
    
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      } else {
        const token = await getToken();
        const { data } = await axios.get(`${backendUrl}/api/educator/update-role`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setIsEducator(true);
          navigate("/educator");
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 border-b  ${
        isScrolled ? "py-3 shadow-lg bg-white" : "py-4"
      } ${
        !isScrolled && !isCourseListPage
          ? "bg-gradient-to-r from-cyan-500 to-blue-600"
          : "bg-white"
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center" aria-label="Go to homepage">
              <div className="bg-white rounded-full p-1 mr-2 shadow-md">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-9 h-9 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
              </div>
              <span
                className={`text-2xl font-extrabold tracking-tighter ${
                  isScrolled || isCourseListPage ? "text-gray-800" : "text-white"
                }`}
              >
                Edu<span className="text-amber-400">Hub</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={becomeEducator}
                  className={`font-medium transition-colors duration-200 rounded-md px-3 py-2 ${
                    isScrolled || isCourseListPage
                      ? "text-gray-700 hover:text-blue-600"
                      : "text-white hover:text-amber-200"
                  }`}
                  aria-label="Become a teacher"
                >
                  {isEducator ? "Educator Dashboard" : "Become a Teacher"}
                </button>
                <span
                  className={`${
                    isScrolled || isCourseListPage ? "text-gray-300" : "text-blue-200"
                  }`}
                >
                  |
                </span>
                <Link
                  to="/my-enrollments"
                  className={`font-medium transition-colors duration-200 rounded-md px-3 py-2 ${
                    isScrolled || isCourseListPage
                      ? "text-gray-700 hover:text-blue-600"
                      : "text-white hover:text-amber-200"
                  }`}
                  aria-label="My enrollments"
                >
                  My Enrollments
                </Link>
                <Link
                  to="/course-list"
                  className={`font-medium transition-colors duration-200 rounded-md px-3 py-2 ${
                    isScrolled || isCourseListPage
                      ? "text-gray-700 hover:text-blue-600"
                      : "text-white hover:text-amber-200"
                  }`}
                  aria-label="Browse courses"
                >
                  Browse Courses
                </Link>
              </div>
            )}

            <div className="flex items-center space-x-3 ml-4">
              {user ? (
                <div className="flex items-center">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-9 h-9 border-2 border-white",
                        userButtonPopoverCard: "shadow-xl rounded-xl",
                      },
                    }}
                  />
                </div>
              ) : (
                <button
                  className="px-4 py-2 bg-amber-400 text-blue-900 font-bold rounded-lg hover:bg-amber-300 
                    transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none 
                    focus:ring-2 focus:ring-amber-300"
                  aria-label="Create account"
                  onClick={openSignIn}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-3">
            {user ? (
              <div className="flex items-center mr-2">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 border-2 border-white",
                      userButtonPopoverCard: "shadow-xl rounded-xl",
                    },
                  }}
                />
              </div>
            ) : (
              <button
                className={`p-1.5 rounded-full ${
                  isScrolled || isCourseListPage ? "bg-gray-100" : "bg-white bg-opacity-20"
                }`}
                aria-label="Sign in"
                onClick={openSignIn}
              >
                <img
                  src={assets.user_icon}
                  alt="User profile"
                  className="w-6 h-6 object-contain"
                />
              </button>
            )}

            <button
              className={`p-1.5 rounded-md ${
                isScrolled || isCourseListPage
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/20"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div
          className={`px-4 pt-2 pb-4 space-y-2 ${
            isScrolled || isCourseListPage ? "bg-white shadow-md" : "bg-blue-700"
          }`}
        >
          {user && (
            <>
              <button
                onClick={becomeEducator}
                className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  isScrolled || isCourseListPage
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-blue-600"
                }`}
                aria-label="Become a teacher"
              >
                {isEducator ? "Educator Dashboard" : "Become a Teacher"}
              </button>
              <Link
                to="/my-enrollments"
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  isScrolled || isCourseListPage
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-blue-600"
                }`}
                aria-label="My enrollments"
              >
                My Enrollments
              </Link>
              <Link
                to="/course-list"
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  isScrolled || isCourseListPage
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-blue-600"
                }`}
                aria-label="Browse courses"
              >
                Browse Courses
              </Link>
            </>
          )}

          <div className="pt-2">
            {!user && (
              <button
                className={`w-full px-4 py-3 font-bold rounded-lg transition-colors duration-200 ${
                  isScrolled || isCourseListPage
                    ? "bg-amber-400 text-blue-900 hover:bg-amber-300"
                    : "bg-white text-blue-600 hover:bg-gray-100"
                }`}
                aria-label="Create account"
                onClick={openSignIn}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;