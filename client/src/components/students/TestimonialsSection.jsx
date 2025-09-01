import { assets, dummyTestimonial } from "../../assets/assets";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const TestimonialsSection = () => {
  return (
    <div className="py-16 px-4 sm:px-8 lg:px-16 xl:px-40 bg-gradient-to-b from-cyan-50/30 to-white relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-cyan-200/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow">
            <span className="text-xs font-bold text-white tracking-wider uppercase">
              Learner Success Stories
            </span>
          </div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Transformative{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700">
              Learning Journeys
            </span>
          </motion.h2>

          <motion.p
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Hear directly from our learners as they share their transformative
            journeys, successes, and the impactful role our platform has played
            in their lives.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {dummyTestimonial.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start mb-5">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow"
                />

                <div className="ml-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <img
                        key={i}
                        src={
                          i < Math.floor(testimonial.rating)
                            ? assets.star
                            : assets.emptyStar
                        }
                        alt="star"
                        className="w-4 h-4 mr-0.5"
                      />
                    ))}
                    <span className="text-sm font-medium text-gray-700 ml-1">
                      {testimonial.rating}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed italic">
                "{testimonial.feedback}"
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >

        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
