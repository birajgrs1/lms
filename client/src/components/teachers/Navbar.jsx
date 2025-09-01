import { UserButton, useUser } from "@clerk/clerk-react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { Link } from "react-router-dom";

const Navbar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();
  console.log(educatorData);

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
      <Link to="/" className="flex items-center">
        <div className="bg-white rounded-full p-1 mr-2 shadow-md">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 w-9 h-9 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
        </div>
        <span className="text-2xl font-extrabold tracking-tighter text-gray-800">
          Edu<span className="text-amber-400">Hub</span>
        </span>
      </Link>
      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi! {user ? user.fullName : "Developers"} </p>
        {user ? <UserButton/> : <img className="max-w-8" src={assets.profile_img} alt="Profile" />}
      </div>
    </div>
  );
};

export default Navbar;

