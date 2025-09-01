import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="hero flex flex-col items-center justify-center w-full min-h-[85vh] pt-20 md:pt-40 px-6 sm:px-10 space-y-8 text-center bg-gradient-to-b from-cyan-100/70 to-blue-50 relative overflow-hidden">
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-cyan-300/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-16 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl"></div>

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 mx-auto relative z-10 leading-tight tracking-tight">
          Design your destiny with courses crafted for your success.
          <span className="block w-full h-1 mt-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-left"></span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 mx-auto relative z-10 leading-relaxed opacity-0 animate-fadeIn delay-300 max-w-3xl">
          We offer expert-led instruction, immersive learning experiences, and a
          vibrant community to support your journey toward excellence.
        </p>

        <div className="flex justify-center">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default Hero;
