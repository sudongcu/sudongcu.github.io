import { motion } from 'framer-motion';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const SectionHeader = ({ index, label, title, description, className = '' }) => (
  <motion.div
    className={className}
    variants={container}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
  >
    <motion.div variants={item} className="flex items-center gap-3">
      <span className="section-label">{index}</span>
      <span className="h-px w-8 bg-frost/40" aria-hidden />
      <span className="section-label">{label}</span>
    </motion.div>

    <motion.h2
      variants={item}
      className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ice-50 md:text-5xl lg:text-6xl"
    >
      {title}
    </motion.h2>

    {description && (
      <motion.p variants={item} className="mt-5 max-w-2xl text-lg text-ice-200/70">
        {description}
      </motion.p>
    )}
  </motion.div>
);

export default SectionHeader;
