import { motion } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { CONTACT_INFO } from '../../constants';
import SectionHeader from '../ui/SectionHeader';
import Magnetic from '../ui/Magnetic';
import FrostPanel from '../ui/FrostPanel';

const EASE = [0.16, 1, 0.3, 1];

const SOCIALS = [
  { icon: Github, url: CONTACT_INFO.github, label: 'GitHub' },
  { icon: Linkedin, url: CONTACT_INFO.linkedin, label: 'LinkedIn' },
];

const Contact = () => (
  <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
    <div className="aurora-blob animate-aurora-1 -bottom-[30vw] left-1/2 h-[60vw] w-[60vw] -translate-x-1/2 bg-frost/20" />

    <div className="section-container relative">
      <SectionHeader
        index="05"
        label="Contact"
        title={
          <>
            Have something in mind?
            <br />
            <span className="text-ice">I'm one message away.</span>
          </>
        }
      />

      <div className="mt-14 grid items-end gap-10 lg:grid-cols-12">
        <motion.div
          className="lg:col-span-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <Magnetic strength={0.12}>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="group inline-flex items-center gap-3 break-all font-display text-[clamp(1.5rem,4.5vw,3.5rem)] font-bold leading-tight tracking-tight text-ice-50 transition-colors hover:text-frost"
            >
              {CONTACT_INFO.email}
              <ArrowUpRight className="h-[0.8em] w-[0.8em] shrink-0 text-frost transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <div className="hairline mt-6" aria-hidden />
          <p className="mt-4 text-ice-200/60">
            Projects, opportunities, or just to say hi — replies usually within a day.
          </p>
        </motion.div>

        <motion.div
          className="flex gap-3 lg:col-span-4 lg:justify-end"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        >
          {SOCIALS.map(({ icon: Icon, url, label }) => (
            <Magnetic key={label} strength={0.25}>
              <FrostPanel
                as="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="glass glass-hover grid h-14 w-14 place-items-center text-ice-200 hover:text-frost"
              >
                <Icon className="h-5 w-5" />
              </FrostPanel>
            </Magnetic>
          ))}
        </motion.div>
      </div>

      <motion.footer
        className="mt-24 flex flex-col items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ice-200/40 sm:flex-row"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span>© {new Date().getFullYear()} Donggu Seo</span>
        <span>Designed & built in Seoul</span>
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-frost"
        >
          Back to top
          <ArrowUp className="h-3 w-3" />
        </a>
      </motion.footer>
    </div>
  </section>
);

export default Contact;
