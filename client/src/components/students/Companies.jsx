import { assets } from "../../assets/assets.js";

const Companies = () => {
  const companies = [
    { logo: assets.microsoft_logo, name: "Microsoft" },
    { logo: assets.walmart_logo, name: "Walmart" },
    { logo: assets.accenture_logo, name: "Accenture" },
    { logo: assets.adobe_logo, name: "Adobe" },
    { logo: assets.paypal_logo, name: "PayPal" },
  ];

  return (
    <div className="pt-16 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-sm md:text-base font-medium text-cyan-600 tracking-wider uppercase">
          Trusted by Global Professionals
        </p>
        <h2 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900">
          Preferred by Industry Leaders
        </h2>
        <div className="mt-4 w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mt-10">
        {companies.map((company, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center group"
          >
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:scale-105 border border-gray-100">
              <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="w-16 h-16 md:w-24 md:h-24 object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
            <p className="mt-4 text-sm md:text-base font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
              {company.name}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Companies;


