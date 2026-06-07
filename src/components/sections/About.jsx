import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowRight } from 'lucide-react';

const About = () => {
  const handleContactClick = (e) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (!element) return;
    const offset = 80;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

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
                "Hi, I'm Donggu Seo — developer and startup co-founder. After 12 years of development and team leadership, I now build every part of the product solo, with Claude as my daily partner. I make things, ship them, and learn fast.",
              ]}
              wrapper="p"
              speed={70}
              className="text-gray-300 text-lg leading-relaxed text-center"
              cursor={false}
            />

            <div className="mt-8 pt-6 border-t border-dark-600/60 text-center">
              <p className="text-gray-400 mb-4">
                Have something in mind? I'm one message away.
              </p>
              <a
                href="#contact"
                onClick={handleContactClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
              >
                Contact
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
