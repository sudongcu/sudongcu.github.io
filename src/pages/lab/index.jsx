import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, FlaskConical, Smartphone } from 'lucide-react';
import LabShell from './LabShell';
import { useSeo } from '../../hooks/useSeo';

// Experiments are numbered in the order they went on the bench. EXP-02 exists
// but is restricted (not listed), so the open slot is EXP-03.
const TOOLS = [
  {
    id: 'EXP-01',
    slug: 'phoneframe',
    title: 'PhoneFrame',
    description: 'Wrap a screenshot in a phone mockup and download it as a PNG. Portrait or landscape is detected for you.',
    icon: Smartphone,
    thumbnail: '/labs/phoneframe.png',
    specs: ['Image', 'Mockup', 'PNG export'],
  },
];
const NEXT_SLOT = 'EXP-03';

const reveal = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

const Lab = () => {
  useSeo({
    title: 'Lab — Free Browser Developer Tools | DG.DEV',
    description: 'Compact web tools that run entirely in your browser. No signup, no uploads. PhoneFrame mockup generator and more.',
    path: '/lab',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'DG.DEV Lab',
      url: 'https://sudongcu.github.io/lab/',
      description: 'Collection of free browser-based developer tools.',
    },
  });

  return (
    <LabShell
      name="Lab"
      icon={FlaskConical}
      back="/"
      backLabel="DG.DEV"
      readout={{ text: `${TOOLS.length} experiment${TOOLS.length === 1 ? '' : 's'} live`, state: 'on' }}
    >
      <motion.section {...reveal(0)} className="mb-12 max-w-2xl">
        <p className="lab-label mb-4">Bench · browser-only tools</p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ice-50 sm:text-5xl" style={{ textWrap: 'balance' }}>
          Small tools, run on your own machine.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ice-300">
          Each one does a single job inside this browser tab. Nothing is uploaded and there is nothing to sign up for —
          pick a specimen and try it.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {TOOLS.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <motion.div key={tool.slug} {...reveal(0.1 + idx * 0.08)}>
              <Link
                to={`/lab/${tool.slug}`}
                className="lab-panel group block h-full overflow-hidden transition-colors duration-300 hover:border-frost/50"
              >
                {tool.thumbnail ? (
                  <div className="lab-corners aspect-[2/1] overflow-hidden bg-abyss">
                    <img
                      src={tool.thumbnail}
                      alt={`${tool.title} preview`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                ) : (
                  <div className="lab-corners grid aspect-[2/1] place-items-center bg-abyss text-frost">
                    <Icon className="h-8 w-8" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="lab-label text-frost/80">{tool.id}</span>
                    <ArrowUpRight className="h-4 w-4 text-ice-400 transition-colors group-hover:text-frost" />
                  </div>
                  <h2 className="mt-2 font-display text-xl font-extrabold tracking-tight text-ice-50">{tool.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ice-300">{tool.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tool.specs.map((spec) => (
                      <span key={spec} className="lab-tag">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}

        <motion.div
          {...reveal(0.1 + TOOLS.length * 0.08)}
          className="lab-panel flex min-h-[220px] flex-col overflow-hidden border-dashed"
        >
          <div className="lab-hazard h-1.5 opacity-60" aria-hidden />
          <div className="flex flex-1 flex-col justify-center gap-2 p-5">
            <span className="lab-label text-frost/80">{NEXT_SLOT} · reserved</span>
            <p className="text-sm leading-relaxed text-ice-300">The next experiment is on the bench. Check back later.</p>
          </div>
        </motion.div>
      </div>
    </LabShell>
  );
};

export default Lab;
