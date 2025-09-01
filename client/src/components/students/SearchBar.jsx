import { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({data}) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data: '');

  const onSearchHandler = (e) =>{
    e.preventDefault();
    navigate(`/course-list/`+input);
  }
  return (
    <form onSubmit={onSearchHandler} className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm max-w-xl w-full md:h-14 h-12 px-2 transition-all focus-within:ring-2 focus-within:ring-blue-400">
      <img
        src={assets.search_icon}
        alt="search-icon"
        className="w-6 h-6 mx-3 opacity-60"
      />
      <input
        type="text"
        placeholder="Search Courses"
        onChange={(e) => setInput(e.target.value)}
        value={input}
        className="w-full h-full text-sm sm:text-base text-gray-700 placeholder-gray-400 bg-transparent outline-none"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium md:px-6 px-4 py-2 rounded-full transition-colors duration-200"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
