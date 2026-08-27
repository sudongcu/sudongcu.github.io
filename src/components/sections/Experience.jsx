import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { __iconNode as trophy } from 'lucide-react/dist/esm/icons/trophy.js';
import { __iconNode as cart } from 'lucide-react/dist/esm/icons/shopping-cart.js';
import { __iconNode as server } from 'lucide-react/dist/esm/icons/server.js';
import { __iconNode as plane } from 'lucide-react/dist/esm/icons/plane.js';
import { __iconNode as factory } from 'lucide-react/dist/esm/icons/factory.js';
import { bowlingBall } from '../ui/ice/customSymbols';
import { EXPERIENCES } from '../../constants';
import { periodParts } from '../../utils/period';
import SectionHeader from '../ui/SectionHeader';
import IceLayer from '../ui/ice/IceLayer';
import useBurst from '../ui/useBurst';

const EASE = [0.16, 1, 0.3, 1];

/** Domain symbols the ice assembles into when a row is clicked. */
const SYMBOLS = { trophy, cart, server, plane, factory, bowling: bowlingBall };
const SYMBOL_ANCHOR = { x: 0.13, y: 0.64 };

const ExperienceRow = ({ exp, index, formed, onToggle }) => {
  const rowRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [burst, trigger] = useBurst();
  const active = hovered || formed;
  const symbol = formed ? SYMBOLS[exp.symbol] ?? null : null;
  const period = periodParts(exp.start, exp.end);

  return (
    <motion.li
      ref={rowRef}
      className="group relative isolate border-b border-white/[0.06] py-8 last:border-b-0 md:grid md:cursor-pointer md:grid-cols-12 md:gap-8 md:py-10"
      onMouseEnter={() => {
        setHovered(true);
        trigger();
      }}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: EASE }}
    >
      {/* frosted pane behind the row: frost grows on hover, ice assembles the symbol on click */}
      <span
        aria-hidden
        className={`frost pointer-events-none absolute -inset-x-5 inset-y-2 -z-10 hidden rounded-2xl transition-colors duration-500 md:block ${
          active ? 'bg-white/[0.035]' : 'bg-white/0'
        }`}
      >
        <IceLayer
          active={active}
          burst={burst}
          symbol={symbol}
          anchor={SYMBOL_ANCHOR}
          symbolSize={150}
          symbolStep={3}
          seeds={32}
          reach={0.3}
          clearRootRef={rowRef}
        />
      </span>
      {/* mobile rail dot */}
      <span
        aria-hidden
        className="absolute -left-[5px] top-10 h-2.5 w-2.5 rounded-full bg-frost shadow-[0_0_16px_rgba(127,230,255,0.9)] md:hidden"
      />

      <div className="pl-6 md:col-span-3 md:pl-0">
        <div data-frost-clear className="font-mono text-[11px] uppercase tracking-[0.2em]">
          <p className="whitespace-nowrap text-frost/80">
            {period.from} ~{' '}
            {period.current ? (
              <span className="inline-flex items-center gap-1.5 text-mint">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
                </span>
                {period.to}
              </span>
            ) : (
              period.to
            )}
          </p>
          <p className="mt-1.5 text-ice-200/45">{period.duration}</p>
        </div>
        <p
          data-frost-clear
          className={`mt-2 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-ice-200/40 transition-opacity duration-500 md:block ${
            hovered && !formed ? 'opacity-100' : 'opacity-0'
          }`}
        >
          click to crystallize
        </p>
      </div>

      <div data-frost-clear className="mt-2 pl-6 md:col-span-6 md:mt-0 md:pl-0">
        <h3 className="font-display text-2xl font-bold tracking-tight text-ice-50 transition-colors group-hover:text-frost md:text-3xl">
          {exp.title}
        </h3>
        {exp.companyUrl ? (
          <a
            href={exp.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-1 inline-flex items-center gap-1 text-ice-200/70 transition-colors hover:text-ice-50"
          >
            {exp.company}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : (
          <p className="mt-1 text-ice-200/70">{exp.company}</p>
        )}
        <p className="mt-4 leading-relaxed text-ice-200/60">{exp.description}</p>
      </div>

      <div data-frost-clear className="mt-5 flex flex-wrap content-start gap-2 pl-6 md:col-span-3 md:mt-0 md:justify-end md:pl-0">
        {exp.technologies.map((tech) => (
          <span key={tech} className="chip !px-2.5 !py-0.5 !text-xs">
            {tech}
          </span>
        ))}
      </div>
    </motion.li>
  );
};

const Experience = () => {
  const [formedId, setFormedId] = useState(null);

  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="section-container relative">
        <SectionHeader
          index="02"
          label="Experience"
          title={
            <>
              ERP, travel, e-commerce —
              <br />
              and now, <span className="text-ice">my own thing.</span>
            </>
          }
        />

        <ol className="relative mt-16 ml-1 border-l border-white/10 md:ml-0 md:border-0">
          {EXPERIENCES.map((exp, i) => (
            <ExperienceRow
              key={exp.id}
              exp={exp}
              index={i}
              formed={formedId === exp.id}
              onToggle={() => setFormedId((id) => (id === exp.id ? null : exp.id))}
            />
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
