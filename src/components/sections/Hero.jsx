import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { HERO_TEXT, HERO_TICKER } from '../../constants';
import HeroCanvas from '../canvas/HeroCanvas';
import Magnetic from '../ui/Magnetic';
import FrostPanel from '../ui/FrostPanel';
import IceLayer from '../ui/ice/IceLayer';
import useSeason from '../../theme/useSeason';
import SeasonRail from '../ui/SeasonRail';

const EASE = [0.16, 1, 0.3, 1];

const lettersContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.35 } },
};

const letter = {
  hidden: { y: '125%', rotate: 5, opacity: 0 },
  visible: { y: 0, rotate: 0, opacity: 1, transition: { duration: 0.95, ease: EASE } },
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, delay, ease: EASE },
  },
});

/**
 * Per-letter reveal. The gradient class goes on each letter (not the wrapper):
 * animated children get their own compositing layer, which breaks an
 * ancestor's `background-clip: text`.
 */
/**
 * Per-letter reveal. Wrapper padding keeps the reveal clip clear of glyph
 * overshoot. Each letter also gets right padding (cancelled by a negative
 * margin): the h1's negative tracking pushes every glyph past its own box, and
 * a text-clipped gradient background never paints outside the box — without
 * the padding the overhang (the right side of "O") renders transparent.
 */
const Word = ({ text, letterClassName = '' }) => (
  <span className="-mx-[0.06em] -mb-[0.12em] -mt-[0.08em] inline-block overflow-hidden px-[0.06em] pb-[0.12em] pt-[0.08em] align-top">
    {text.split('').map((ch, i) => (
      <motion.span
        key={`${ch}-${i}`}
        variants={letter}
        className={`-mr-[0.12em] inline-block pr-[0.12em] ${letterClassName}`}
      >
        {ch}
      </motion.span>
    ))}
  </span>
);

const supportsWebGL = () => {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

const useSeoulTime = () => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
};

const Hero = () => {
  const sectionRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const time = useSeoulTime();
  const { season, config } = useSeason();
  const TickerIcon = config.Icon;
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    // Mount the 3D scene after first paint, and only where WebGL exists.
    if (!supportsWebGL()) return undefined;
    const id = window.requestAnimationFrame(() => setShowCanvas(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Cursor spotlight (page-space) + normalized pointer for the 3D rig
  const mx = useMotionValue(-2000);
  const my = useMotionValue(-2000);
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });
  const spotlight = useMotionTemplate`radial-gradient(720px circle at ${sx}px ${sy}px, rgba(127,230,255,0.10), transparent 60%)`;

  useEffect(() => {
    const onMove = (e) => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
      pointerRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mx, my]);

  const [first, last] = HERO_TEXT.name;

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-abyss"
    >
      {/* Aurora */}
      <div className="aurora-blob animate-aurora-1 -left-[15vw] -top-[20vh] h-[70vw] w-[70vw] bg-glacier/25" />
      <div className="aurora-blob animate-aurora-2 -right-[10vw] top-[10vh] h-[55vw] w-[55vw] bg-aurora/25" />
      <div className="aurora-blob animate-aurora-3 bottom-[-20vh] left-[30vw] h-[45vw] w-[45vw] bg-mint/15" />

      {/* Fine grid + vignette */}
      <div className="grid-lines absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_30%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(var(--c-abyss))_100%)]" />

      {/* Seasonal growth creeping in from the corners */}
      <div className="pointer-events-none absolute inset-0 z-[3]" aria-hidden>
        <IceLayer active frost="corners" level={0.5} seeds={18} reach={0.15} ripples={false} />
      </div>

      {/* Cursor spotlight */}
      <motion.div className="pointer-events-none absolute inset-0 z-[1]" style={{ background: spotlight }} />

      {/* 3D seasonal glass logo */}
      {showCanvas && (
        <motion.div
          className="absolute inset-0 z-[2] opacity-70 md:opacity-100 lg:left-[32%]"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.2, ease: EASE }}
        >
          <HeroCanvas pointerRef={pointerRef} season={season} />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        className="section-container relative z-10 flex min-h-screen flex-col justify-end pb-32 pt-36"
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp(0.15)} className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            <span className="text-xs font-medium tracking-wide text-ice-100">{HERO_TEXT.status}</span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ice-200/50">
            {HERO_TEXT.eyebrow}
            {time && <span className="ml-3 text-frost/80">{time} KST</span>}
          </span>
        </motion.div>

        <motion.h1
          variants={lettersContainer}
          className="mt-8 font-display text-[clamp(3.6rem,13vw,11.5rem)] font-extrabold leading-[0.86] tracking-tightest text-ice-50"
        >
          <Word text={first} />
          <br />
          <Word text={last} letterClassName="text-ice" />
        </motion.h1>

        <motion.p
          variants={fadeUp(0.9)}
          className="mt-8 max-w-xl text-lg leading-relaxed text-ice-200/80 md:text-xl"
        >
          {HERO_TEXT.description}
        </motion.p>

        <motion.div variants={fadeUp(1.05)} className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic>
            <a href="#contact" className="btn-frost group">
              {HERO_TEXT.ctaPrimary}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <FrostPanel as={Link} to="/lab" className="btn-ghost relative">
              {HERO_TEXT.ctaSecondary}
            </FrostPanel>
          </Magnetic>
        </motion.div>

        <motion.div variants={fadeUp(1.2)} className="mb-4 mt-8 md:hidden">
          <SeasonRail orientation="horizontal" />
        </motion.div>
      </motion.div>

      {/* Season dial */}
      <motion.div
        className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 md:block lg:right-10"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.9, ease: EASE }}
      >
        <SeasonRail orientation="vertical" />
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        className="absolute bottom-24 right-6 z-10 hidden flex-col items-center gap-3 text-ice-200/50 transition-colors hover:text-frost md:flex lg:right-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">Scroll</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.a>

      {/* Ticker */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="hairline" />
        <div className="flex overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="animate-marquee flex shrink-0 whitespace-nowrap will-change-transform">
            {[...HERO_TICKER, ...HERO_TICKER].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex items-center gap-8 pr-8 font-mono text-[11px] uppercase tracking-[0.3em] text-ice-200/50"
              >
                {item}
                <TickerIcon className="h-3 w-3 text-frost/50" aria-hidden />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
