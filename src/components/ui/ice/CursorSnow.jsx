import { useEffect, useRef } from 'react';
import IceScene from './engine';
import useSeason from '../../../theme/useSeason';

const PX_PER_FLAKE = 9; // one puff per this many pixels of cursor travel
const MAX_PER_EVENT = 4;

/**
 * Seasonal dust that trails the cursor while it moves and settles the moment
 * it stops, plus a burst on click. Skipped on touch devices and for users who
 * prefer reduced motion.
 */
const CursorSnow = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const { config } = useSeason();
  const style = config.engine;

  useEffect(() => {
    sceneRef.current?.setStyle(style);
  }, [style]);

  // A season switch throws the new season's pieces from the switch point.
  useEffect(() => {
    const onSeasonBurst = (e) => {
      const scene = sceneRef.current;
      if (!scene) return;
      scene.setStyle(style);
      const { x, y } = e.detail ?? { x: window.innerWidth / 2, y: 64 };
      scene.burst(x, y, 64);
      scene.shower(28);
    };
    window.addEventListener('season:burst', onSeasonBurst);
    return () => window.removeEventListener('season:burst', onSeasonBurst);
  }, [style]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const scene = new IceScene(canvas, style);
    sceneRef.current = scene;
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
      sceneRef.current = null;
    };
    // mount-only; the season effect above restyles the live scene
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
