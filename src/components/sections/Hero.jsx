import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { HERO_TEXT } from '../../constants';
import HeroCanvas from '../canvas/HeroCanvas';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e1e_1px,transparent_1px),linear-gradient(to_bottom,#1e1e1e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="text-left space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={itemVariants}
              className="text-primary-400 text-lg font-medium tracking-wide"
            >
              {HERO_TEXT.greeting}
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="text-white">{HERO_TEXT.name}</span>
              <br />
              <span className="text-gradient">{HERO_TEXT.title}</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-gray-400 text-lg max-w-2xl leading-relaxed"
            >
              {HERO_TEXT.description}
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-4 pt-4">
              <a
                href="#projects"
                className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
              >
                {HERO_TEXT.cta}
              </a>
              <a
                href="#contact"
                className="px-8 py-3 border border-primary-500 text-primary-400 hover:bg-primary-500/10 rounded-lg font-medium transition-colors"
              >
                Get In Touch
              </a>
            </motion.div>
          </motion.div>

          {/* 3D Canvas */}
          <div className="relative h-[400px] lg:h-[600px]">
            <motion.div
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <HeroCanvas mousePosition={mousePosition} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <ChevronDown className="w-8 h-8 text-primary-400" />
      </motion.div>
    </section>
  );
};

export default Hero;
