import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ABOUT_STATS, ABOUT_TEXT } from '../../constants';
import SectionHeader from '../ui/SectionHeader';
import CountUp from '../ui/CountUp';
import FrostPanel from '../ui/FrostPanel';

const EASE = [0.16, 1, 0.3, 1];

const About = () => {
  const handleContactClick = (e) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.pageYOffset - 96;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <section id="about" className="relative overflow-hidden py-24 sm:py-32">
      <div className="aurora-blob animate-aurora-2 -right-[10vw] top-0 h-[40vw] w-[40vw] bg-aurora/20" />

      <div className="section-container relative">
        <SectionHeader
          index="01"
          label="About"
          title={
            <>
              Twelve years of shipping.
              <br />
              Now, <span className="text-ice">the whole product, alone.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <FrostPanel className="glass glass-hover h-full p-8 md:p-10">
              <p data-frost-clear className="text-lg leading-relaxed text-ice-200/85 md:text-xl">{ABOUT_TEXT}</p>
              <div data-frost-clear className="mt-8">
                <a href="#contact" onClick={handleContactClick} className="link-underline font-medium">
                  Say hello
                  <ArrowRight className="h-4 w-4 text-frost" />
                </a>
              </div>
            </FrostPanel>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
            {ABOUT_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="h-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.1, ease: EASE }}
              >
                <FrostPanel className="glass glass-hover flex h-full items-baseline justify-between gap-4 p-5 sm:flex-col sm:items-start md:p-6">
                  <CountUp
                    data-frost-clear
                    to={stat.value}
                    suffix={stat.suffix}
                    className="font-display text-4xl font-extrabold tracking-tight text-ice-50 md:text-5xl"
                  />
                  <p data-frost-clear className="text-right text-xs leading-snug text-ice-200/60 sm:mt-3 sm:text-left md:text-sm">{stat.label}</p>
                </FrostPanel>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
