import { motion } from 'framer-motion';
import { Code2, Database, Wrench } from 'lucide-react';
import { TECH_STACK } from '../../constants';
import { formatTenure, tenureOf } from '../../utils/tenure';
import SectionHeader from '../ui/SectionHeader';
import TiltCard from '../ui/TiltCard';

const EASE = [0.16, 1, 0.3, 1];

const CATEGORY_ICONS = {
  frontend: Code2,
  backend: Database,
  tools: Wrench,
};

// Resolve every skill's time in production once, from the experience timeline.
// Dated skills rank by tenure; the rest follow in their declared order without
// a bar. All bars share one scale — the longest-held tool is the full width.
const CATEGORIES = Object.entries(TECH_STACK).map(([key, category]) => {
  const skills = category.skills.map((skill) => {
    const { months, since } = skill.match ? tenureOf(skill.match) : { months: 0, since: null };
    return { name: skill.name, months, since };
  });
  const dated = skills.filter((s) => s.months > 0).sort((a, b) => b.months - a.months);
  const undated = skills.filter((s) => s.months === 0);
  return { key, title: category.title, skills: [...dated, ...undated] };
});
const MAX_MONTHS = Math.max(1, ...CATEGORIES.flatMap((c) => c.skills.map((s) => s.months)));

const TechStack = () => (
  <section id="skills" className="relative overflow-hidden py-24 sm:py-32">
    <div className="aurora-blob animate-aurora-3 -left-[15vw] bottom-0 h-[45vw] w-[45vw] bg-glacier/20" />

    <div className="section-container relative">
      <SectionHeader
        index="03"
        label="Stack"
        title={
          <>
            Tools I reach for <span className="text-ice">without thinking.</span>
          </>
        }
        description="Backend-heavy by history, full-stack by necessity."
      />

      <motion.p
        className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ice-200/45"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Bars · years in production, from the timeline above · longest {formatTenure(MAX_MONTHS)}
      </motion.p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {CATEGORIES.map((category, i) => {
          const Icon = CATEGORY_ICONS[category.key];
          return (
            <motion.div
              key={category.key}
              className="h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            >
              <TiltCard className="glass glass-hover flex h-full flex-col p-7">
                <div data-frost-clear className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-frost/10 text-frost">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-xl font-bold tracking-tight text-ice-50">
                      {category.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-ice-200/40">0{i + 1}</span>
                </div>

                <ul data-frost-clear className="mt-7 space-y-4">
                  {category.skills.map((skill, j) => (
                    <li key={skill.name}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-medium text-ice-100">{skill.name}</span>
                        <span className="shrink-0 font-mono text-[11px] tabular-nums text-ice-200/60">
                          {skill.months > 0 ? (
                            <>
                              {formatTenure(skill.months)}
                              <span className="text-ice-200/35"> · since {skill.since}</span>
                            </>
                          ) : (
                            <span className="text-ice-200/35">—</span>
                          )}
                        </span>
                      </div>
                      <div aria-hidden className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
                        {skill.months > 0 && (
                          <motion.div
                            className="h-full rounded-full bg-frost/85"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(skill.months / MAX_MONTHS) * 100}%` }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 1.1, delay: 0.2 + j * 0.06, ease: EASE }}
                          />
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default TechStack;
