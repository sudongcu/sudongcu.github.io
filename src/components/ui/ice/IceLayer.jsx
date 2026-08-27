import { useEffect, useRef } from 'react';
import IceScene from './engine';
import { symbolPoints } from './symbols';

const REST_LEVEL = 0.45;

/**
 * Canvas overlay that frosts its positioned parent.
 *
 *  active   – grow frost up to `level` (and keep it) while true; dims back to the
 *             resting level (or clears, when `rest` is false) when it turns false
 *  burst    – increment to drop a shower of ice from the top edge
 *  frost    – 'edges' | 'corners' | false
 *  rest     – grow a light frost on mount (off by default: panes rest as clear
 *             ice and only frost over on hover, so the page stays calm)
 *  symbol   – lucide `__iconNode`; particles assemble into it, `null` shatters it
 *  anchor   – where the symbol sits, as fractions of the parent size
 *
 * Elements marked `data-frost-clear` (searched under the canvas parent, or under
 * `clearRootRef` when the text lives outside the frosted pane) are kept clear:
 * crystals stop growing when they reach them, so copy stays legible.
 */
const IceLayer = ({
  active = false,
  burst = 0,
  frost = 'edges',
  rest = false,
  level = 1,
  seeds = 26,
  reach = 0.34,
  symbol = null,
  anchor = { x: 0.5, y: 0.5 },
  symbolSize = 150,
  symbolStep = 3,
  clearRootRef = null,
  className = '',
}) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const clearRef = useRef(clearRootRef);
  clearRef.current = clearRootRef;
  const { x: anchorX, y: anchorY } = anchor;

  const measureClear = () => {
    const canvas = canvasRef.current;
    const scene = sceneRef.current;
    if (!canvas || !scene) return;
    const parent = canvas.parentElement;
    const root = clearRef.current?.current ?? parent;
    const base = parent.getBoundingClientRect();
    const rects = [];
    root.querySelectorAll('[data-frost-clear]').forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.width > 0 && b.height > 0) {
        rects.push({ x: b.left - base.left, y: b.top - base.top, w: b.width, h: b.height });
      }
    });
    scene.setClearRects(rects);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const parent = canvas.parentElement;
    const scene = new IceScene(canvas);
    sceneRef.current = scene;

    const measure = () => {
      const r = parent.getBoundingClientRect();
      scene.resize(r.width, r.height);
      measureClear();
    };
    measure();
    if (rest && frost) {
      scene.growFrost({ from: frost, seeds: Math.ceil(seeds * 0.4), reach: reach * 0.6, target: REST_LEVEL });
    }

    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    return () => {
      observer.disconnect();
      scene.destroy();
      sceneRef.current = null;
    };
    // mount-only: rest/frost/seeds/reach describe the initial pane
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !frost) return;
    if (active) {
      measureClear();
      scene.growFrost({ from: frost, seeds, reach, target: level, append: true });
    } else {
      scene.setFrostLevel(rest ? Math.min(REST_LEVEL, level) : 0);
    }
  }, [active, frost, rest, level, seeds, reach]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (scene && burst) scene.shower();
  }, [burst]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    if (!symbol) {
      scene.release();
      return undefined;
    }
    let cancelled = false;
    symbolPoints(symbol, symbolSize, symbolStep).then((pts) => {
      if (!cancelled && sceneRef.current) sceneRef.current.form(pts, { x: anchorX, y: anchorY });
    });
    return () => {
      cancelled = true;
    };
  }, [symbol, symbolSize, symbolStep, anchorX, anchorY]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 h-full w-full ${className}`}
    />
  );
};

export default IceLayer;
