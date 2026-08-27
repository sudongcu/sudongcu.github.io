import { useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import IceLayer from './ice/IceLayer';
import useBurst from './useBurst';

/** 3D tilt-on-hover card with a cursor-following glow and growing frost. */
const TiltCard = ({ children, className = '', max = 7, frost = true }) => {
  const [hovered, setHovered] = useState(false);
  const [burst, trigger] = useBurst();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 20 });
  const sy = useSpring(py, { stiffness: 160, damping: 20 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const glowX = useTransform(sx, [0, 1], ['0%', '100%']);
  const glowY = useTransform(sy, [0, 1], ['0%', '100%']);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX} ${glowY}, rgba(127,230,255,0.14), transparent 60%)`;

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const enter = () => {
    setHovered(true);
    trigger();
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    setHovered(false);
  };

  return (
    <div
      className="h-full [perspective:1000px]"
      onMouseMove={handleMove}
      onMouseEnter={enter}
      onMouseLeave={reset}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative ${frost ? 'frost' : ''} ${className}`}
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500"
          style={{ background: glow, opacity: hovered ? 1 : 0 }}
        />
        {frost && <IceLayer active={hovered} burst={burst} />}
      </motion.div>
    </div>
  );
};

export default TiltCard;
