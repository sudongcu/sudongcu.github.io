import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { EXPERIENCES } from '../../constants';

const Experience = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="experience" className="relative py-8 sm:py-12 lg:py-20 bg-dark-800">
      <div className="section-container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            My professional journey and career highlights
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-400 to-transparent" />

          {EXPERIENCES.map((experience, index) => (
            <motion.div
              key={experience.id}
              variants={itemVariants}
              className={`relative mb-12 ${
                index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2'
              }`}
            >
              <div
                className={`flex items-start gap-6 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 -ml-3 md:-ml-4 mt-1">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/50">
                    <Briefcase className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                </div>

                {/* Content Card */}
                <div
                  className={`flex-1 ml-20 md:ml-0 ${
                    index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                  }`}
                >
                  <div className="bg-dark-700 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow border border-dark-600 hover:border-primary-500/30">
                    {/* Period Badge */}
                    <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 text-sm font-medium rounded-full mb-3">
                      {experience.period}
                    </span>

                    {/* Title & Company */}
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {experience.title}
                    </h3>
                    {experience.companyUrl ? (
                      <a 
                        href={experience.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-400 font-medium mb-4 inline-block hover:text-primary-300 transition-colors"
                      >
                        {experience.company}
                      </a>
                    ) : (
                      <p className="text-primary-400 font-medium mb-4">
                        {experience.company}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      {experience.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-dark-600 text-gray-300 text-sm rounded-md hover:bg-primary-500/20 hover:text-primary-400 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
