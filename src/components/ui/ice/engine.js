/**
 * IceScene — a small 2D canvas engine for the glacier UI.
 *
 *  • Frost: dendritic crystals that grow inward from the edges (or corners) of
 *    the pane with hexagonal 60° branching, drawn progressively.
 *  • Particles: snowflakes, ice splinters and glow dots that fall as a shower,
 *    or gather into a target shape ("form") and shatter apart again ("release").
 *
 * The render loop only runs while something is moving.
 */

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

const GROW_SPEED = 240; // px per second along a stem
const DEPTH_WIDTH = [1.5, 1.1, 0.8, 0.6];
const DEPTH_ALPHA = [0.9, 0.75, 0.6, 0.45];
const MAX_SEGMENTS = 3200;

const makeGlowSprite = () => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(200,240,255,0.85)');
  grad.addColorStop(0.65, 'rgba(127,230,255,0.25)');
  grad.addColorStop(1, 'rgba(127,230,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
};

let glowSprite = null;

export default class IceScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.w = 0;
    this.h = 0;
    this.dpr = 1;
    this.time = 0;
    this.last = 0;
    this.raf = 0;
    this.particles = [];
    this.segments = [];
    this.growEnd = 0;
    this.frostAlpha = 0;
    this.frostTarget = 0;
    this.clearRects = [];
    this.rings = [];
    this.loop = this.loop.bind(this);
    if (!glowSprite) glowSprite = makeGlowSprite();
  }

  /* ---------- lifecycle ---------- */

  resize(w, h) {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = w;
    this.h = h;
    this.canvas.width = Math.max(1, Math.round(w * this.dpr));
    this.canvas.height = Math.max(1, Math.round(h * this.dpr));
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.draw();
  }

  start() {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  destroy() {
    this.stop();
    this.particles = [];
    this.segments = [];
  }

  alive() {
    return (
      this.particles.length > 0 ||
      this.rings.length > 0 ||
      this.time < this.growEnd ||
      Math.abs(this.frostAlpha - this.frostTarget) > 0.004
    );
  }

  loop(now) {
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.time += dt;
    this.update(dt);
    this.draw();
    if (this.alive()) this.raf = requestAnimationFrame(this.loop);
    else this.raf = 0;
  }

  /* ---------- frost ---------- */

  growFrost({ from = 'edges', seeds = 26, reach = 0.42, target = 1, append = false } = {}) {
    if (!this.w || !this.h) return;
    if (!append) {
      this.segments = [];
      this.growEnd = this.time;
    }
    this.frostTarget = target;
    const { w, h } = this;
    const maxLen = Math.min(w, h) * reach;

    for (let i = 0; i < seeds; i += 1) {
      let x;
      let y;
      let angle;
      if (from === 'corners') {
        const cx = Math.random() < 0.5 ? 0 : w;
        const cy = Math.random() < 0.5 ? 0 : h;
        const along = rand(0, Math.min(w, h) * 0.3);
        if (Math.random() < 0.5) {
          x = cx === 0 ? along : w - along;
          y = cy;
        } else {
          x = cx;
          y = cy === 0 ? along : h - along;
        }
        angle = Math.atan2(h / 2 - y, w / 2 - x) + rand(-0.7, 0.7);
      } else {
        const side = Math.floor(rand(0, 4));
        if (side === 0) {
          x = rand(0, w);
          y = 0;
          angle = Math.PI / 2;
        } else if (side === 1) {
          x = w;
          y = rand(0, h);
          angle = Math.PI;
        } else if (side === 2) {
          x = rand(0, w);
          y = h;
          angle = -Math.PI / 2;
        } else {
          x = 0;
          y = rand(0, h);
          angle = 0;
        }
        angle += rand(-0.7, 0.7);
      }
      this.branch(x, y, angle, maxLen * rand(0.35, 1), 0, this.time + rand(0, 0.35));
      if (this.segments.length > MAX_SEGMENTS) break;
    }
    if (this.segments.length > MAX_SEGMENTS) {
      this.segments.splice(0, this.segments.length - MAX_SEGMENTS);
    }
    this.start();
  }

  branch(x, y, angle, startLen, depth, start) {
    if (this.inClear(x, y)) return;
    // Stop at the first clear zone so crystals wrap around text instead of crossing it.
    let len = startLen;
    if (this.clearRects.length) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      for (let l = 4; l < len; l += 4) {
        if (this.inClear(x + cos * l, y + sin * l)) {
          len = l - 4;
          break;
        }
      }
    }
    if (len < 3) return;
    const dur = len / GROW_SPEED;
    const x2 = x + Math.cos(angle) * len;
    const y2 = y + Math.sin(angle) * len;
    this.segments.push({ x1: x, y1: y, x2, y2, depth, start, dur });
    this.growEnd = Math.max(this.growEnd, start + dur);
    if (depth >= 3 || len < 6) return;

    const spacing = depth === 0 ? 13 : 9;
    const n = Math.floor(len / spacing);
    for (let i = 1; i <= n; i += 1) {
      const f = i / (n + 1);
      const bx = x + (x2 - x) * f;
      const by = y + (y2 - y) * f;
      const bl = len * (1 - f) * rand(0.3, 0.55);
      if (bl < 4) continue;
      const side = i % 2 === 0 ? 1 : -1;
      const spread = (Math.PI / 3) * rand(0.9, 1.1);
      this.branch(bx, by, angle + side * spread, bl, depth + 1, start + dur * f);
      if (Math.random() < 0.4) {
        this.branch(bx, by, angle - side * spread, bl * 0.75, depth + 1, start + dur * f);
      }
    }
  }

  /** Rectangles (host-relative px) that frost must not grow into — text blocks. */
  setClearRects(rects) {
    this.clearRects = rects;
  }

  inClear(x, y, margin = 10) {
    for (const r of this.clearRects) {
      if (x >= r.x - margin && x <= r.x + r.w + margin && y >= r.y - margin && y <= r.y + r.h + margin) {
        return true;
      }
    }
    return false;
  }

  /** Fade the frost toward `level` (0 clears it entirely). */
  setFrostLevel(level) {
    this.frostTarget = level;
    this.start();
  }

  /* ---------- particles ---------- */

  makeParticle(over = {}) {
    const r = Math.random();
    const type = over.type ?? (r < 0.25 ? 'flake' : r < 0.6 ? 'shard' : 'dot');
    const size = type === 'flake' ? rand(5, 9) : type === 'shard' ? rand(3, 6) : rand(1.6, 3);
    return {
      type,
      size,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      rot: rand(0, TAU),
      vr: rand(-1.6, 1.6),
      alpha: 0,
      phase: rand(0, TAU),
      mode: 'fall',
      life: 0,
      maxLife: 2,
      delay: 0,
      k: 5,
      tx: 0,
      ty: 0,
      settleAlpha: 0.9,
      ...over,
    };
  }

  /** Ice falls from the top edge. */
  shower(count = 18) {
    if (!this.w || !this.h) return;
    for (let i = 0; i < count; i += 1) {
      this.particles.push(
        this.makeParticle({
          x: rand(0, this.w),
          y: rand(-24, -4),
          vx: rand(-14, 14),
          vy: rand(30, 90),
          maxLife: rand(1.6, 3),
        }),
      );
    }
    this.start();
  }

  /** Puff fine snow from a point (cursor trail); inherits a little of the cursor's motion. */
  emit(x, y, vx = 0, vy = 0, count = 1) {
    if (!this.w || !this.h || this.particles.length > 400) return;
    for (let i = 0; i < count; i += 1) {
      const flake = Math.random() < 0.1;
      this.particles.push(
        this.makeParticle({
          type: flake ? 'flake' : 'dot',
          size: flake ? rand(2.4, 3.6) : rand(0.7, 1.5),
          x: x + rand(-4, 4),
          y: y + rand(-4, 4),
          vx: -vx * 0.08 + rand(-12, 12),
          vy: -vy * 0.08 + rand(8, 30),
          maxLife: rand(0.7, 1.5),
        }),
      );
    }
    this.start();
  }

  /** Ice shatter on click: a ring of splinters flies out, a thin shockwave fades. */
  burst(x, y, count = 22) {
    if (!this.w || !this.h) return;
    for (let i = 0; i < count; i += 1) {
      const ang = (i / count) * TAU + rand(-0.2, 0.2);
      const speed = rand(90, 260);
      const r = Math.random();
      const type = r < 0.3 ? 'shard' : r < 0.45 ? 'flake' : 'dot';
      this.particles.push(
        this.makeParticle({
          type,
          size: type === 'shard' ? rand(2, 3.4) : type === 'flake' ? rand(2.6, 4) : rand(0.9, 1.8),
          x,
          y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed - 40,
          rot: ang + Math.PI / 2,
          vr: rand(-6, 6),
          maxLife: rand(0.5, 1.1),
        }),
      );
    }
    this.rings.push({ x, y, life: 0, maxLife: 0.55 });
    this.start();
  }

  /** Gather particles into `points` (offsets around the anchor, in px). */
  form(points, anchor = { x: 0.5, y: 0.5 }) {
    if (!this.w || !this.h || points.length === 0) return;
    const ax = this.w * anchor.x;
    const ay = this.h * anchor.y;
    const pts = points.slice();
    for (let i = pts.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pts[i], pts[j]] = [pts[j], pts[i]];
    }

    const pool = this.particles.slice(0, pts.length);
    while (pool.length < pts.length) {
      // New crystals enter from a random edge so the symbol visibly assembles.
      const side = Math.floor(rand(0, 4));
      const x = side === 1 ? this.w + 8 : side === 3 ? -8 : rand(0, this.w);
      const y = side === 0 ? -8 : side === 2 ? this.h + 8 : rand(0, this.h);
      const r = Math.random();
      const type = r < 0.12 ? 'flake' : r < 0.3 ? 'shard' : 'dot';
      const size = type === 'flake' ? rand(2.8, 4.2) : type === 'shard' ? rand(1.6, 2.6) : rand(1.1, 1.8);
      pool.push(this.makeParticle({ x, y, type, size }));
    }

    pool.forEach((p, i) => {
      if (p.mode === 'fall' && p.size > 3) p.size *= 0.6; // reuse falling ice, but keep the silhouette crisp
      p.mode = 'form';
      p.tx = ax + pts[i].x;
      p.ty = ay + pts[i].y;
      p.delay = rand(0, 0.4);
      p.k = rand(3.5, 6.5);
      p.settleAlpha = p.type === 'dot' ? 0.95 : 0.85;
    });
    this.particles = pool;
    this.start();
  }

  /** Blow a formed symbol apart; the pieces fall away. */
  release() {
    let any = false;
    for (const p of this.particles) {
      if (p.mode !== 'form') continue;
      any = true;
      p.mode = 'fall';
      p.vx = rand(-90, 90);
      p.vy = rand(-150, -30);
      p.vr = rand(-4, 4);
      p.life = 0;
      p.maxLife = rand(1.2, 2);
    }
    if (any) this.start();
  }

  /* ---------- simulation ---------- */

  update(dt) {
    const rate = this.frostTarget > this.frostAlpha ? 4 : 1.6; // grow fast, melt slowly
    this.frostAlpha += (this.frostTarget - this.frostAlpha) * Math.min(1, dt * rate);
    if (this.frostTarget === 0 && this.frostAlpha < 0.01) {
      this.frostAlpha = 0;
      this.segments = [];
      this.growEnd = 0;
    }

    this.rings = this.rings.filter((r) => {
      r.life += dt;
      return r.life < r.maxLife;
    });

    const { h, time } = this;
    const alive = [];
    for (const p of this.particles) {
      if (p.mode === 'fall') {
        p.life += dt;
        p.vy += 55 * dt;
        p.x += (p.vx + Math.sin(time * 1.7 + p.phase) * 12) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        const fadeIn = clamp01(p.life / 0.25);
        const fadeOut = clamp01((p.maxLife - p.life) / 0.5);
        p.alpha = Math.min(fadeIn, fadeOut) * 0.9;
        if (p.life >= p.maxLife || p.y > h + 12) continue;
      } else if (p.delay > 0) {
        p.delay -= dt;
      } else {
        const k = Math.min(1, dt * p.k);
        const jx = Math.sin(time * 1.3 + p.phase) * 0.7;
        const jy = Math.cos(time * 1.1 + p.phase * 1.3) * 0.7;
        p.x += (p.tx + jx - p.x) * k;
        p.y += (p.ty + jy - p.y) * k;
        p.rot += p.vr * 0.3 * dt;
        const twinkle = 0.8 + 0.2 * Math.sin(time * 3 + p.phase * 2);
        p.alpha += (p.settleAlpha * twinkle - p.alpha) * Math.min(1, dt * 4);
      }
      alive.push(p);
    }
    this.particles = alive;
  }

  /* ---------- rendering ---------- */

  draw() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);
    this.drawFrost(ctx);
    this.drawRings(ctx);
    this.drawParticles(ctx);
  }

  drawRings(ctx) {
    if (this.rings.length === 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const r of this.rings) {
      const t = r.life / r.maxLife;
      const ease = 1 - (1 - t) * (1 - t);
      const radius = 6 + ease * 64;
      ctx.globalAlpha = (1 - t) * 0.7;
      ctx.lineWidth = 1.5 * (1 - t) + 0.5;
      ctx.strokeStyle = 'rgba(200,240,255,1)';
      ctx.beginPath();
      ctx.arc(r.x, r.y, radius, 0, TAU);
      ctx.stroke();
      // a fainter, slower inner halo
      ctx.globalAlpha = (1 - t) * 0.25;
      ctx.beginPath();
      ctx.arc(r.x, r.y, radius * 0.55, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawFrost(ctx) {
    const a = this.frostAlpha;
    if (a <= 0.005 || this.segments.length === 0) return;
    const { time } = this;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // soft glow underneath
    ctx.globalAlpha = a * 0.35;
    ctx.strokeStyle = 'rgba(150,220,255,1)';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    for (const s of this.segments) {
      const p = clamp01((time - s.start) / s.dur);
      if (p <= 0) continue;
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x1 + (s.x2 - s.x1) * p, s.y1 + (s.y2 - s.y1) * p);
    }
    ctx.stroke();

    // crisp crystal veins, batched per depth
    const tips = [];
    for (let d = 0; d < DEPTH_WIDTH.length; d += 1) {
      ctx.globalAlpha = a * DEPTH_ALPHA[d];
      ctx.lineWidth = DEPTH_WIDTH[d];
      ctx.strokeStyle = 'rgba(240,250,255,1)';
      ctx.beginPath();
      for (const s of this.segments) {
        if (s.depth !== d) continue;
        const p = clamp01((time - s.start) / s.dur);
        if (p <= 0) continue;
        const ex = s.x1 + (s.x2 - s.x1) * p;
        const ey = s.y1 + (s.y2 - s.y1) * p;
        ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(ex, ey);
        if (p < 1) tips.push(ex, ey);
      }
      ctx.stroke();
    }

    // sparkling growth tips
    if (tips.length) {
      ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath();
      for (let i = 0; i < tips.length; i += 2) {
        ctx.moveTo(tips[i] + 1.4, tips[i + 1]);
        ctx.arc(tips[i], tips[i + 1], 1.4, 0, TAU);
      }
      ctx.fill();
    }
    ctx.restore();
  }

  drawParticles(ctx) {
    if (this.particles.length === 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const p of this.particles) {
      if (p.alpha <= 0.01) continue;
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      if (p.type === 'dot') {
        const r = p.size * 2.4;
        ctx.drawImage(glowSprite, -r, -r, r * 2, r * 2);
      } else if (p.type === 'shard') {
        const r = p.size * 1.2;
        ctx.globalAlpha = p.alpha * 0.5;
        ctx.drawImage(glowSprite, -r, -r, r * 2, r * 2);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = 'rgba(205,241,255,0.7)';
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.9);
        ctx.lineTo(p.size * 0.5, 0);
        ctx.lineTo(0, p.size * 1.9);
        ctx.lineTo(-p.size * 0.5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.95)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.5);
        ctx.lineTo(0, p.size * 1.5);
        ctx.stroke();
      } else {
        const r = p.size * 1.1;
        ctx.globalAlpha = p.alpha * 0.45;
        ctx.drawImage(glowSprite, -r, -r, r * 2, r * 2);
        ctx.globalAlpha = p.alpha;
        ctx.strokeStyle = 'rgba(238,249,255,0.95)';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        for (let i = 0; i < 6; i += 1) {
          const ang = (i * Math.PI) / 3;
          const cx = Math.cos(ang);
          const sy = Math.sin(ang);
          ctx.moveTo(0, 0);
          ctx.lineTo(cx * p.size, sy * p.size);
          const bx = cx * p.size * 0.6;
          const by = sy * p.size * 0.6;
          const tl = p.size * 0.34;
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + Math.cos(ang + Math.PI / 3) * tl, by + Math.sin(ang + Math.PI / 3) * tl);
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + Math.cos(ang - Math.PI / 3) * tl, by + Math.sin(ang - Math.PI / 3) * tl);
        }
        ctx.stroke();
      }
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
    ctx.restore();
  }
}
