import { assets } from "../../assets/assets";

const CallToAction = () => {
  return (
    <div className="bg-gradient-to-br from-cyan-50 via-white to-blue-50 py-16 px-4 sm:px-8 lg:px-16 xl:px-40 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
          Learn anything, anytime, anywhere
        </h2>
        <p className="text-gray-600 text-lg sm:text-xl mb-8">
          Unlock your full potential with flexible, on-demand learning. Learn at your pace, from any device, anytime.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            Get Started
          </button>
          <button className="inline-flex items-center px-6 py-3 text-cyan-600 border border-cyan-500 font-semibold rounded-lg hover:bg-cyan-50 transition-all duration-300">
            Learn More
            <img
              src={assets.arrow_icon}
              alt="arrow icon"
              className="ml-2 w-4 h-4"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
