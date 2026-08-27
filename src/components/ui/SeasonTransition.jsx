import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useSeason from '../../theme/useSeason';

/**
 * Makes a season change feel like weather arriving: the new palette washes
 * across the page in a circle from wherever the user last clicked, and the
 * cursor layer bursts the new season's pieces from that point.
 */
const SeasonTransition = () => {
  const { season } = useSeason();
  const [origin, setOrigin] = useState({ x: window.innerWidth / 2, y: 64 });
  const mountedRef = useRef(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const onDown = (e) => setOrigin({ x: e.clientX, y: e.clientY });
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => window.removeEventListener('pointerdown', onDown);
  }, []);

  // The very first season is the page load — no wash for that one.
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    setAnimateIn(true);
    window.dispatchEvent(new CustomEvent('season:burst', { detail: origin }));
    // origin is read at the moment the season flips
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season]);

  if (!animateIn) return null;

  const at = `${origin.x}px ${origin.y}px`;
  return (
    <motion.div
      key={season}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[58]"
      style={{
        background: `radial-gradient(circle at ${at}, rgb(var(--c-frost) / 0.55), rgb(var(--c-aurora) / 0.28) 38%, rgb(var(--c-glacier) / 0.12) 60%, transparent 78%)`,
      }}
      initial={{ clipPath: `circle(0px at ${at})`, opacity: 1 }}
      animate={{ clipPath: `circle(160vmax at ${at})`, opacity: [1, 1, 0] }}
      transition={{
        clipPath: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 1.25, times: [0, 0.55, 1], ease: 'easeOut' },
      }}
    />
  );
};

export default SeasonTransition;
