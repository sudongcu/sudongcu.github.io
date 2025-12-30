import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="relative py-20 bg-dark-800">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
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
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 bg-primary-500/20 rounded-full">
                <User className="w-12 h-12 text-primary-400" />
              </div>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed text-center mb-6">
              I'm a passionate full-stack developer with a strong focus on creating
              elegant, efficient, and user-friendly web applications. With expertise
              in modern frameworks and technologies, I bring ideas to life through
              clean code and thoughtful design.
            </p>
            
            <p className="text-gray-400 text-base leading-relaxed text-center">
              I'm constantly learning and adapting to new technologies to stay at 
              the forefront of web development. My goal is to build digital experiences 
              that not only look great but also provide real value to users.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
