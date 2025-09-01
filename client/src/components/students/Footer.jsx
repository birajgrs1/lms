import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-20 pb-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-20">
          <div>
            <Link to="/" className="flex items-center mb-6">
              <div className="bg-white rounded-full p-1.5 mr-3 shadow-md">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                Edu<span className="text-amber-400">Hub</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-xs leading-relaxed">
              Empowering learners worldwide with high-quality education.
              Transform your future with our expert-led courses.
            </p>
            <div className="flex space-x-4">
              {[
                assets.facebook_icon,
                assets.twitter_icon,
                assets.instagram_icon,
              ].map((icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors duration-300"
                  aria-label={`Social media icon ${index + 1}`}
                >
                  <img src={icon} alt="" className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-10 h-1 bg-cyan-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {["Home", "About Us", "Courses", "Pricing", "Blog"].map(
                (item, index) => (
                  <li key={index}>
                    <Link
                      to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6 sm:p-8 border border-gray-700 shadow-md">
              <h3 className="text-lg font-bold mb-4 relative inline-block">
                Newsletter
                <span className="absolute -bottom-2 left-0 w-10 h-1 bg-cyan-500 rounded-full"></span>
              </h3>
              <p className="text-gray-400 mb-6 max-w-lg leading-relaxed">
                Join our mailing list to receive the latest course updates,
                industry news, and special promotions directly in your inbox.
              </p>
              <form className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mb-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} EduHub. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item, index) => (
                <Link
                  key={index}
                  to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors duration-300"
                >
                  {item}
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 z-50"
        aria-label="Back to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
