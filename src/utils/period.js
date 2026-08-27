const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Resolved once per page load; "Present" durations are measured against this.
const NOW = new Date();

const parseMonth = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m };
};

const monthLabel = ({ y, m }) => `${MONTHS[m - 1]} ${y}`;

const plural = (n, unit) => `${n} ${unit}${n === 1 ? '' : 's'}`;

/**
 * Inclusive duration between two 'YYYY-MM' months, e.g. Jan 2024 → Nov 2025
 * is "1 year 11 months" (both endpoint months count).
 */
export const formatDuration = (start, end = null) => {
  const a = parseMonth(start);
  const b = end ? parseMonth(end) : { y: NOW.getFullYear(), m: NOW.getMonth() + 1 };
  const total = Math.max(1, (b.y - a.y) * 12 + (b.m - a.m) + 1);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (years) parts.push(plural(years, 'year'));
  if (months || !years) parts.push(plural(months, 'month'));
  return parts.join(' ');
};

/** Pieces of a period line so the UI can style "Present" on its own. */
export const periodParts = (start, end = null) => ({
  from: monthLabel(parseMonth(start)),
  to: end ? monthLabel(parseMonth(end)) : 'Present',
  duration: formatDuration(start, end),
  current: !end,
});

/** "Mar 2026 ~ Present (6 months)" / "Jan 2024 ~ Nov 2025 (1 year 11 months)" */
export const formatPeriod = (start, end = null) => {
  const { from, to, duration } = periodParts(start, end);
  return `${from} ~ ${to} (${duration})`;
};
