/**
 * IceScene — a small 2D canvas engine for the seasonal UI.
 *
 *  • Growth: organic strokes that grow inward from the edges (or corners) of a
 *    pane — frost dendrites (winter), curling vines with buds (spring), bare
 *    branches with leaves (autumn). Summer grows nothing and ripples instead.
 *  • Particles: per-season pieces (snowflakes / shards, petals, sparks /
 *    bubbles, leaves, glow dots) that fall or rise as a shower, trail the
 *    cursor, gather into a target shape ("form") and shatter apart ("release").
 *
 * The look is driven entirely by a `style` object (see theme/seasons.js).
 * The render loop only runs while something is moving.
 */

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const GROW_SPEED = 240; // px per second along a stem
const DEPTH_WIDTH = [1.5, 1.1, 0.8, 0.6];
const DEPTH_ALPHA = [0.9, 0.75, 0.6, 0.45];
const MAX_SEGMENTS = 3200;

export const DEFAULT_STYLE = {
  growth: 'frost',
  spread: Math.PI / 3,
  spreadJitter: 0.1,
  curl: 0,
  stroke: [240, 250, 255],
  glow: [150, 220, 255],
  tip: 'dot',
  tipColor: [255, 255, 255],
  particles: ['flake', 'flake', 'shard', 'shard', 'shard', 'dot', 'dot', 'dot'],
  colors: { core: [255, 255, 255], mid: [200, 240, 255], edge: [127, 230, 255] },
  gravity: 55,
  rise: false,
  ripples: false,
  ring: [200, 240, 255],
};

const spriteCache = new Map();
const glowSprite = ({ core, mid, edge }) => {
  const key = [...core, ...mid, ...edge].join(',');
  if (spriteCache.has(key)) return spriteCache.get(key);
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, rgba(core, 1));
  grad.addColorStop(0.3, rgba(mid, 0.85));
  grad.addColorStop(0.65, rgba(edge, 0.25));
  grad.addColorStop(1, rgba(edge, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  spriteCache.set(key, c);
  return c;
};

const TUMBLERS = new Set(['petal', 'leaf']);

export default class IceScene {
  constructor(canvas, style = DEFAULT_STYLE) {
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
    this.rippleClock = 0;
    this.ripplesEnabled = true;
    this.loop = this.loop.bind(this);
    this.setStyle(style);
  }

  /* ---------- lifecycle ---------- */

  setStyle(style) {
    this.style = { ...DEFAULT_STYLE, ...style };
    this.sprite = glowSprite(this.style.colors);
  }

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
    this.rings = [];
  }

  get ambient() {
    return this.style.ripples && this.ripplesEnabled && this.frostTarget > 0.5;
  }

  alive() {
    return (
      this.particles.length > 0 ||
      this.rings.length > 0 ||
      this.ambient ||
      this.time < this.growEnd ||
      Math.abs(this.frostAlpha - this.frostTarget) > 0.004
    );
  }

  loop(now) {
    // Release the handle before drawing: if a frame throws, the next start()
    // must still be able to schedule a new one instead of seeing a stale id.
    this.raf = 0;
    // The rAF timestamp can precede the performance.now() taken in start() by
    // a frame or more after a heavy frame; a negative dt would push a fresh
    // ring's life below zero and hand arc() a negative radius.
    const dt = Math.min(Math.max(0, (now - this.last) / 1000), 0.05);
    this.last = now;
    this.time += dt;
    this.update(dt);
    this.draw();
    if (this.alive()) this.raf = requestAnimationFrame(this.loop);
  }

  /* ---------- growth ---------- */

  /** Rectangles (host-relative px) that growth must not enter — text blocks. */
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

  resetFrost() {
    this.segments = [];
    this.growEnd = 0;
    this.frostAlpha = 0;
  }

  growFrost({ from = 'edges', seeds = 26, reach = 0.42, target = 1, append = false } = {}) {
    if (!this.w || !this.h) return;
    if (!append) {
      this.segments = [];
      this.growEnd = this.time;
    }
    this.frostTarget = target;
    if (this.style.growth === 'none') {
      this.start();
      return;
    }
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

    const { spread, spreadJitter, curl } = this.style;
    // Organic styles bend: split long stems and let the second half drift.
    const bends = curl > 0 && len > 28 && depth < 2;
    const segLen = bends ? len * rand(0.4, 0.6) : len;
    const dur = segLen / GROW_SPEED;
    const x2 = x + Math.cos(angle) * segLen;
    const y2 = y + Math.sin(angle) * segLen;
    this.segments.push({ x1: x, y1: y, x2, y2, depth, start, dur, angle });
    this.growEnd = Math.max(this.growEnd, start + dur);

    if (depth < 3 && segLen >= 6) {
      const spacing = depth === 0 ? 13 : 9;
      const n = Math.floor(segLen / spacing);
      for (let i = 1; i <= n; i += 1) {
        const f = i / (n + 1);
        const bx = x + (x2 - x) * f;
        const by = y + (y2 - y) * f;
        const bl = segLen * (1 - f) * rand(0.3, 0.55) + (bends ? len * 0.15 : 0);
        if (bl < 4) continue;
        const side = i % 2 === 0 ? 1 : -1;
        const a = spread * rand(1 - spreadJitter, 1 + spreadJitter) + rand(-curl, curl);
        this.branch(bx, by, angle + side * a, bl, depth + 1, start + dur * f);
        if (Math.random() < 0.4) {
          this.branch(bx, by, angle - side * a, bl * 0.75, depth + 1, start + dur * f);
        }
      }
    }
    if (bends) {
      this.branch(x2, y2, angle + rand(-curl, curl), len - segLen, depth, start + dur);
    }
  }

  /** Fade the growth toward `level` (0 clears it entirely). */
  setFrostLevel(level) {
    this.frostTarget = level;
    this.start();
  }

  /* ---------- particles ---------- */

  pickType(list = this.style.particles) {
    return list[Math.floor(Math.random() * list.length)];
  }

  sizeFor(type) {
    switch (type) {
      case 'flake':
        return rand(5, 9);
      case 'shard':
        return rand(3, 6);
      case 'petal':
        return rand(4, 7);
      case 'leaf':
        return rand(4.5, 7.5);
      case 'spark':
        return rand(2, 4);
      case 'bubble':
        return rand(2, 4.5);
      default:
        return rand(1.6, 3);
    }
  }

  makeParticle(over = {}) {
    const type = over.type ?? this.pickType();
    const size = over.size ?? this.sizeFor(type);
    const tumble = TUMBLERS.has(type) ? 2.4 : 1;
    return {
      type,
      size,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      rot: rand(0, TAU),
      vr: rand(-1.6, 1.6) * tumble,
      alpha: 0,
      phase: rand(0, TAU),
      shade: Math.random(),
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

  /** Pieces drift in from the top (or rise from the bottom for `rise` styles). */
  shower(count = 18) {
    if (!this.w || !this.h) return;
    const { rise } = this.style;
    for (let i = 0; i < count; i += 1) {
      this.particles.push(
        this.makeParticle({
          x: rand(0, this.w),
          y: rise ? this.h + rand(4, 24) : rand(-24, -4),
          vx: rand(-14, 14),
          vy: rise ? rand(-90, -30) : rand(30, 90),
          maxLife: rand(1.6, 3),
        }),
      );
    }
    this.start();
  }

  /** Puff a little from a point (cursor trail); inherits some of the cursor's motion. */
  emit(x, y, vx = 0, vy = 0, count = 1) {
    if (!this.w || !this.h || this.particles.length > 400) return;
    const { rise } = this.style;
    for (let i = 0; i < count; i += 1) {
      const type = Math.random() < 0.25 ? this.pickType() : 'dot';
      const size = type === 'dot' ? rand(0.7, 1.5) : this.sizeFor(type) * 0.5;
      this.particles.push(
        this.makeParticle({
          type,
          size,
          x: x + rand(-4, 4),
          y: y + rand(-4, 4),
          vx: -vx * 0.08 + rand(-12, 12),
          vy: -vy * 0.08 + (rise ? rand(-30, -8) : rand(8, 30)),
          maxLife: rand(0.7, 1.5),
        }),
      );
    }
    this.start();
  }

  /** Burst on click: pieces fly out in a ring, a thin shockwave fades. */
  burst(x, y, count = 22) {
    if (!this.w || !this.h) return;
    for (let i = 0; i < count; i += 1) {
      const ang = (i / count) * TAU + rand(-0.2, 0.2);
      const speed = rand(90, 260);
      const type = Math.random() < 0.55 ? this.pickType() : 'dot';
      const size = type === 'dot' ? rand(0.9, 1.8) : this.sizeFor(type) * 0.6;
      this.particles.push(
        this.makeParticle({
          type,
          size,
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
    this.rings.push({ x, y, life: 0, maxLife: 0.55, maxR: 64, alpha: 0.7 });
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
      // New pieces enter from a random edge so the symbol visibly assembles.
      const side = Math.floor(rand(0, 4));
      const x = side === 1 ? this.w + 8 : side === 3 ? -8 : rand(0, this.w);
      const y = side === 0 ? -8 : side === 2 ? this.h + 8 : rand(0, this.h);
      const type = Math.random() < 0.3 ? this.pickType() : 'dot';
      const size = type === 'dot' ? rand(1.1, 1.8) : this.sizeFor(type) * 0.45;
      pool.push(this.makeParticle({ x, y, type, size }));
    }

    pool.forEach((p, i) => {
      if (p.mode === 'fall' && p.size > 3) p.size *= 0.6; // reuse loose pieces, keep the silhouette crisp
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

  /** Blow a formed symbol apart; the pieces drift away. */
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
    const { style } = this;
    const rate = this.frostTarget > this.frostAlpha ? 4 : 1.6; // grow fast, melt slowly
    this.frostAlpha += (this.frostTarget - this.frostAlpha) * Math.min(1, dt * rate);
    if (this.frostTarget === 0 && this.frostAlpha < 0.01) {
      this.frostAlpha = 0;
      this.segments = [];
      this.growEnd = 0;
    }

    // Summer: rain on water — soft ripples keep appearing while the pane is active.
    if (this.ambient) {
      this.rippleClock -= dt;
      if (this.rippleClock <= 0) {
        this.rippleClock = rand(0.14, 0.34);
        for (let tries = 0; tries < 5; tries += 1) {
          const x = rand(0, this.w);
          const y = rand(0, this.h);
          if (!this.inClear(x, y, 4)) {
            this.rings.push({ x, y, life: 0, maxLife: rand(1.1, 1.6), maxR: rand(26, 48), alpha: 0.45 });
            break;
          }
        }
      }
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
        p.vy += style.gravity * dt;
        const sway = TUMBLERS.has(p.type) ? 26 : 12;
        p.x += (p.vx + Math.sin(time * 1.7 + p.phase) * sway) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        const fadeIn = clamp01(p.life / 0.25);
        const fadeOut = clamp01((p.maxLife - p.life) / 0.5);
        p.alpha = Math.min(fadeIn, fadeOut) * 0.9;
        if (p.life >= p.maxLife || (style.rise ? p.y < -12 : p.y > h + 12)) continue;
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
    this.drawGrowth(ctx);
    this.drawRings(ctx);
    this.drawParticles(ctx);
  }

  drawGrowth(ctx) {
    const a = this.frostAlpha;
    if (a <= 0.005 || this.segments.length === 0) return;
    const { time, style } = this;
    const stroke = rgba(style.stroke, 1);
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // soft glow underneath
    ctx.globalAlpha = a * 0.35;
    ctx.strokeStyle = rgba(style.glow, 1);
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    for (const s of this.segments) {
      const p = clamp01((time - s.start) / s.dur);
      if (p <= 0) continue;
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x1 + (s.x2 - s.x1) * p, s.y1 + (s.y2 - s.y1) * p);
    }
    ctx.stroke();

    // crisp strokes, batched per depth
    const growingTips = [];
    const grownTips = [];
    for (let d = 0; d < DEPTH_WIDTH.length; d += 1) {
      ctx.globalAlpha = a * DEPTH_ALPHA[d];
      ctx.lineWidth = DEPTH_WIDTH[d];
      ctx.strokeStyle = stroke;
      ctx.beginPath();
      for (const s of this.segments) {
        if (s.depth !== d) continue;
        const p = clamp01((time - s.start) / s.dur);
        if (p <= 0) continue;
        const ex = s.x1 + (s.x2 - s.x1) * p;
        const ey = s.y1 + (s.y2 - s.y1) * p;
        ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(ex, ey);
        if (p < 1) growingTips.push(ex, ey);
        else if (d >= 2) grownTips.push(ex, ey, s.angle);
      }
      ctx.stroke();
    }

    if (style.tip === 'dot' && growingTips.length) {
      ctx.globalAlpha = a;
      ctx.fillStyle = rgba(style.tipColor, 0.95);
      ctx.beginPath();
      for (let i = 0; i < growingTips.length; i += 2) {
        ctx.moveTo(growingTips[i] + 1.4, growingTips[i + 1]);
        ctx.arc(growingTips[i], growingTips[i + 1], 1.4, 0, TAU);
      }
      ctx.fill();
    } else if (style.tip === 'bud' && grownTips.length) {
      ctx.globalAlpha = a * 0.9;
      ctx.fillStyle = rgba(style.tipColor, 1);
      ctx.beginPath();
      for (let i = 0; i < grownTips.length; i += 3) {
        ctx.moveTo(grownTips[i] + 1.8, grownTips[i + 1]);
        ctx.arc(grownTips[i], grownTips[i + 1], 1.8, 0, TAU);
      }
      ctx.fill();
      ctx.globalAlpha = a * 0.35;
      ctx.beginPath();
      for (let i = 0; i < grownTips.length; i += 3) {
        ctx.moveTo(grownTips[i] + 3.6, grownTips[i + 1]);
        ctx.arc(grownTips[i], grownTips[i + 1], 3.6, 0, TAU);
      }
      ctx.fill();
    } else if (style.tip === 'leaf' && grownTips.length) {
      ctx.globalAlpha = a * 0.85;
      for (let i = 0; i < grownTips.length; i += 3) {
        const shade = ((i / 3) * 0.37) % 1;
        ctx.fillStyle = rgba(mix(style.tipColor, style.stroke, shade * 0.6), 1);
        ctx.translate(grownTips[i], grownTips[i + 1]);
        ctx.rotate(grownTips[i + 2] - Math.PI / 2);
        this.leafPath(ctx, 4.2);
        ctx.fill();
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      }
    }
    ctx.restore();
  }

  drawRings(ctx) {
    if (this.rings.length === 0) return;
    const ring = rgba(this.style.ring, 1);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = ring;
    for (const r of this.rings) {
      const t = clamp01(r.life / r.maxLife);
      const ease = 1 - (1 - t) * (1 - t);
      const radius = 6 + ease * r.maxR;
      ctx.globalAlpha = (1 - t) * r.alpha;
      ctx.lineWidth = 1.5 * (1 - t) + 0.5;
      ctx.beginPath();
      ctx.arc(r.x, r.y, radius, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = (1 - t) * r.alpha * 0.35;
      ctx.beginPath();
      ctx.arc(r.x, r.y, radius * 0.55, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }

  leafPath(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s * 0.95, -s * 0.1, 0, s);
    ctx.quadraticCurveTo(-s * 0.95, -s * 0.1, 0, -s);
    ctx.closePath();
  }

  drawParticles(ctx) {
    if (this.particles.length === 0) return;
    const { core, mid, edge } = this.style.colors;
    const sprite = this.sprite;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const p of this.particles) {
      if (p.alpha <= 0.01) continue;
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      const s = p.size;
      switch (p.type) {
        case 'dot': {
          const r = s * 2.4;
          ctx.drawImage(sprite, -r, -r, r * 2, r * 2);
          break;
        }
        case 'shard': {
          const r = s * 1.2;
          ctx.globalAlpha = p.alpha * 0.5;
          ctx.drawImage(sprite, -r, -r, r * 2, r * 2);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = rgba(mid, 0.7);
          ctx.beginPath();
          ctx.moveTo(0, -s * 1.9);
          ctx.lineTo(s * 0.5, 0);
          ctx.lineTo(0, s * 1.9);
          ctx.lineTo(-s * 0.5, 0);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = rgba(core, 0.95);
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -s * 1.5);
          ctx.lineTo(0, s * 1.5);
          ctx.stroke();
          break;
        }
        case 'flake': {
          const r = s * 1.1;
          ctx.globalAlpha = p.alpha * 0.45;
          ctx.drawImage(sprite, -r, -r, r * 2, r * 2);
          ctx.globalAlpha = p.alpha;
          ctx.strokeStyle = rgba(core, 0.95);
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          for (let i = 0; i < 6; i += 1) {
            const ang = (i * Math.PI) / 3;
            const cx = Math.cos(ang);
            const sy = Math.sin(ang);
            ctx.moveTo(0, 0);
            ctx.lineTo(cx * s, sy * s);
            const bx = cx * s * 0.6;
            const by = sy * s * 0.6;
            const tl = s * 0.34;
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(ang + Math.PI / 3) * tl, by + Math.sin(ang + Math.PI / 3) * tl);
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(ang - Math.PI / 3) * tl, by + Math.sin(ang - Math.PI / 3) * tl);
          }
          ctx.stroke();
          break;
        }
        case 'petal': {
          const r = s * 1.3;
          ctx.globalAlpha = p.alpha * 0.3;
          ctx.drawImage(sprite, -r, -r, r * 2, r * 2);
          ctx.globalAlpha = p.alpha * 0.95;
          const g = ctx.createLinearGradient(0, -s, 0, s);
          g.addColorStop(0, rgba(mix(mid, edge, p.shade), 0.95));
          g.addColorStop(1, rgba(core, 0.9));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.bezierCurveTo(s * 0.8, -s * 0.25, s * 0.8, s * 0.65, 0, s);
          ctx.bezierCurveTo(-s * 0.8, s * 0.65, -s * 0.8, -s * 0.25, 0, -s);
          ctx.closePath();
          ctx.fill();
          break;
        }
        case 'leaf': {
          const r = s * 1.1;
          ctx.globalAlpha = p.alpha * 0.25;
          ctx.drawImage(sprite, -r, -r, r * 2, r * 2);
          ctx.globalAlpha = p.alpha * 0.95;
          ctx.fillStyle = rgba(mix(mid, edge, p.shade), 0.95);
          this.leafPath(ctx, s);
          ctx.fill();
          ctx.strokeStyle = rgba(core, 0.55);
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(0, -s * 0.8);
          ctx.lineTo(0, s * 0.8);
          ctx.stroke();
          break;
        }
        case 'spark': {
          const r = s * 2.2;
          ctx.drawImage(sprite, -r, -r, r * 2, r * 2);
          const twinkle = 0.7 + 0.3 * Math.sin(this.time * 9 + p.phase);
          ctx.globalAlpha = p.alpha * twinkle;
          ctx.strokeStyle = rgba(core, 1);
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(-s * 2.2, 0);
          ctx.lineTo(s * 2.2, 0);
          ctx.moveTo(0, -s * 2.2);
          ctx.lineTo(0, s * 2.2);
          ctx.moveTo(-s * 0.9, -s * 0.9);
          ctx.lineTo(s * 0.9, s * 0.9);
          ctx.moveTo(-s * 0.9, s * 0.9);
          ctx.lineTo(s * 0.9, -s * 0.9);
          ctx.stroke();
          break;
        }
        case 'bubble': {
          const r = s * 1.6;
          ctx.fillStyle = rgba(mid, 0.08);
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, TAU);
          ctx.fill();
          ctx.strokeStyle = rgba(edge, 0.8);
          ctx.lineWidth = 0.9;
          ctx.stroke();
          ctx.strokeStyle = rgba(core, 0.9);
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.62, Math.PI * 1.15, Math.PI * 1.55);
          ctx.stroke();
          break;
        }
        default:
          break;
      }
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
    ctx.restore();
  }
}
