import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

const About = () => {
  return (
    <section id="about" className="relative py-8 sm:py-12 lg:py-20 bg-dark-800">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-6 sm:mb-8 lg:mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
        </motion.div>

        {/* About Content */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gradient-to-r from-dark-700 to-dark-600 rounded-2xl p-8 md:p-12 border border-dark-600 hover:border-primary-500/30 transition-all shadow-xl">
            <TypeAnimation
              sequence={[
                'Hi, I am Donggu Seo, a Senior .NET developer with over 11 years of experience in building and operating web services. I\'ve worked across various domains including e-commerce, travel reservations, and back-office systems.',
              ]}
              wrapper="p"
              speed={70}
              className="text-gray-300 text-lg leading-relaxed text-center"
              cursor={false}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
