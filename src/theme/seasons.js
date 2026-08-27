/**
 * Seasonal themes. Everything that changes between seasons lives here or in
 * the matching `[data-season]` block in index.css (the CSS palette has to be
 * available before React mounts, so it is not generated from this file).
 *
 * Token roles (the Tailwind names are winter-flavoured, the roles are not):
 *   abyss / deep      page background, panel background
 *   ice-50 … ice-400  text tints, light → mid
 *   frost             primary accent      glacier   secondary accent
 *   aurora            tertiary accent     mint      "live" indicator
 *
 *   spring  blossom + fresh green        summer  ocean + orange
 *   autumn  sunset + falling leaves      winter  glacier (frost + snow)
 */
import { Flower, Snowflake, Sun, Wheat } from 'lucide-react';

export const SEASON_IDS = ['spring', 'summer', 'autumn', 'winter'];

/** Northern-hemisphere seasons by calendar month. */
export const getSeasonForDate = (date = new Date()) => {
  const m = date.getMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
};

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const SEASONS = {
  winter: {
    id: 'winter',
    label: 'Winter',
    tagline: 'Glacier — frost & snow',
    Icon: Snowflake,
    logo: {
      tint: '#e4f2ff',
      tintMix: 0.35,
      backdrop: ['#f4faff', '#9fe9ff', '#7fd0ff', '#8b9cff'],
      attenuation: '#9fdcff',
      roughness: 0.3,
      sparkles: '#c9ecff',
      lights: { key: '#dff6ff', fillA: '#4cc9f0', fillB: '#8b9cff' },
      env: ['#dff6ff', '#7fe6ff', '#8b9cff'],
    },
    engine: {
      growth: 'frost',
      spread: Math.PI / 3,
      spreadJitter: 0.1,
      curl: 0,
      stroke: rgb('#f0faff'),
      glow: rgb('#96dcff'),
      tip: 'dot',
      tipColor: rgb('#ffffff'),
      particles: ['flake', 'flake', 'shard', 'shard', 'shard', 'dot', 'dot', 'dot'],
      colors: { core: rgb('#ffffff'), mid: rgb('#c8f0ff'), edge: rgb('#7fe6ff') },
      gravity: 55,
      rise: false,
      ripples: false,
      ring: rgb('#c8f0ff'),
    },
  },
  spring: {
    id: 'spring',
    label: 'Spring',
    tagline: 'Blossom — vines & petals',
    Icon: Flower,
    logo: {
      tint: '#ffe6f0',
      tintMix: 0.7,
      backdrop: ['#fff7fb', '#ffb7d5', '#ffd6e6', '#b5f0c2'],
      attenuation: '#ffc2da',
      roughness: 0.28,
      sparkles: '#ffd7e8',
      lights: { key: '#fff0f6', fillA: '#ff9ecb', fillB: '#9be7a8' },
      env: ['#fff0f6', '#ffa6c9', '#9be7a8'],
    },
    engine: {
      growth: 'vine',
      spread: 0.62,
      spreadJitter: 0.3,
      curl: 0.35,
      stroke: rgb('#9be7a8'),
      glow: rgb('#6fc98a'),
      tip: 'bud',
      tipColor: rgb('#ffa6c9'),
      particles: ['petal', 'petal', 'petal', 'petal', 'dot'],
      colors: { core: rgb('#fff0f6'), mid: rgb('#ffa6c9'), edge: rgb('#ff78aa') },
      gravity: 18,
      rise: false,
      ripples: false,
      ring: rgb('#ffc2da'),
    },
  },
  summer: {
    id: 'summer',
    label: 'Summer',
    tagline: 'Ocean — ripples & sunlight',
    Icon: Sun,
    logo: {
      tint: '#d6fbff',
      tintMix: 0.5,
      backdrop: ['#ffffff', '#7ff0e6', '#29c6ff', '#0b5fd6'],
      attenuation: '#7ff0e6',
      roughness: 0.22,
      sparkles: '#ffd9a8',
      lights: { key: '#fff1dc', fillA: '#29e3d3', fillB: '#ff8a3d' },
      env: ['#fff1dc', '#29e3d3', '#ff8a3d'],
    },
    engine: {
      growth: 'none',
      spread: 0,
      spreadJitter: 0,
      curl: 0,
      stroke: rgb('#7ff0e6'),
      glow: rgb('#29e3d3'),
      tip: null,
      tipColor: rgb('#ffffff'),
      particles: ['spark', 'spark', 'bubble', 'bubble', 'dot'],
      colors: { core: rgb('#ffffff'), mid: rgb('#ffd9a8'), edge: rgb('#29e3d3') },
      gravity: -22,
      rise: true,
      ripples: true,
      ring: rgb('#7ff0e6'),
    },
  },
  autumn: {
    id: 'autumn',
    label: 'Autumn',
    tagline: 'Sunset — branches & leaves',
    Icon: Wheat,
    logo: {
      tint: '#ffe9d1',
      tintMix: 0.75,
      backdrop: ['#fff4e6', '#ffc857', '#ff7a45', '#ff4d8d'],
      attenuation: '#ffb26b',
      roughness: 0.3,
      sparkles: '#ffd9a8',
      lights: { key: '#fff1dc', fillA: '#ff7a45', fillB: '#ff4d8d' },
      env: ['#fff1dc', '#ffc857', '#ff4d8d'],
    },
    engine: {
      growth: 'branch',
      spread: 0.85,
      spreadJitter: 0.25,
      curl: 0.25,
      stroke: rgb('#d98c3f'),
      glow: rgb('#ff8c42'),
      tip: 'leaf',
      tipColor: rgb('#ff6b3d'),
      particles: ['leaf', 'leaf', 'leaf', 'leaf', 'dot'],
      colors: { core: rgb('#ffe6be'), mid: rgb('#ffb454'), edge: rgb('#ff6b3d') },
      gravity: 30,
      rise: false,
      ripples: false,
      ring: rgb('#ffd9a8'),
    },
  },
};
