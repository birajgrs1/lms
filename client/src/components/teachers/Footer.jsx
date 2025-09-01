import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-amber-50 py-6 px-4 md:px-8 border-t border-amber-200 shadow-inner">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        
        <Link to="/" className="flex items-center space-x-2 text-gray-800 hover:text-blue-600 transition">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-full shadow-md">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tighter text-gray-800">
            Edu<span className="text-amber-400">Hub</span>
          </span>
        </Link>
        
        <div className="hidden md:block w-px h-12 bg-amber-200"></div>
        
        <p className="text-center text-sm md:text-base text-amber-800">Copyright © 2025 EduHub. All Rights Reserved</p>
      </div>

      <div className="flex justify-center space-x-6 mt-5">
        <a href="#" className="transform hover:scale-110 transition-transform duration-200">
          <img src={assets.facebook_icon} alt="facebook icon" className="w-6 h-6 md:w-7 md:h-7" />
        </a>
        <a href="#" className="transform hover:scale-110 transition-transform duration-200">
          <img src={assets.twitter_icon} alt="twitter icon" className="w-6 h-6 md:w-7 md:h-7" />
        </a>
        <a href="#" className="transform  hover:scale-110 transition-transform duration-200">
          <img src={assets.instagram_icon} alt="instagram icon" className="w-6 h-6 md:w-7 md:h-7" />
        </a>
      </div>
    </footer>
  )
}

export default Footer;