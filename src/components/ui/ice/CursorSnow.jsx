import { useEffect, useRef } from 'react';
import IceScene from './engine';

const PX_PER_FLAKE = 9; // one puff per this many pixels of cursor travel
const MAX_PER_EVENT = 4;

/**
 * Fine snow that trails the cursor while it moves and settles the moment it
 * stops, plus an ice-shatter burst on click. Skipped on touch devices and for
 * users who prefer reduced motion.
 */
const CursorSnow = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const scene = new IceScene(canvas);
    const resize = () => scene.resize(window.innerWidth, window.innerHeight);
    resize();

    let last = null;
    let travelled = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        const dt = Math.max(1, now - last.t);
        travelled += Math.hypot(dx, dy);
        const n = Math.min(MAX_PER_EVENT, Math.floor(travelled / PX_PER_FLAKE));
        if (n > 0) {
          travelled -= n * PX_PER_FLAKE;
          scene.emit(e.clientX, e.clientY, (dx / dt) * 1000, (dy / dt) * 1000, n);
        }
      }
      last = { x: e.clientX, y: e.clientY, t: now };
    };
    const onLeave = () => {
      last = null;
    };
    const onDown = (e) => {
      if (e.button !== 0) return;
      scene.burst(e.clientX, e.clientY);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
      scene.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[55] h-full w-full"
    />
  );
};

export default CursorSnow;
