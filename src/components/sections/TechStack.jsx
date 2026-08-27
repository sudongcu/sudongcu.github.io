import { motion } from 'framer-motion';
import { Code2, Database, Wrench } from 'lucide-react';
import { TECH_STACK } from '../../constants';
import SectionHeader from '../ui/SectionHeader';
import TiltCard from '../ui/TiltCard';

const EASE = [0.16, 1, 0.3, 1];

const CATEGORY_ICONS = {
  frontend: Code2,
  backend: Database,
  tools: Wrench,
};

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

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {Object.entries(TECH_STACK).map(([key, category], i) => {
          const Icon = CATEGORY_ICONS[key];
          return (
            <motion.div
              key={key}
              className="h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            >
              <TiltCard className="glass glass-hover h-full p-7">
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

                <ul data-frost-clear className="mt-7 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <li key={skill.name} className="chip">
                      {skill.name}
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
