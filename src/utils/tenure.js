import { EXPERIENCES } from '../constants';
import { monthsBetween } from './period';

/**
 * Time in production for a skill: the months of every experience whose
 * technologies include one of `match`, added up (the timeline has no
 * overlapping jobs), plus the year it first appears. `months` is 0 when
 * nothing matches.
 */
export const tenureOf = (match, experiences = EXPERIENCES) => {
  let months = 0;
  let since = null;
  for (const exp of experiences) {
    if (!exp.technologies.some((t) => match.includes(t))) continue;
    months += monthsBetween(exp.start, exp.end);
    const year = Number(exp.start.slice(0, 4));
    since = since === null ? year : Math.min(since, year);
  }
  return { months, since };
};

/** "12 yrs" · "5.7 yrs" · "6 mos" — one decimal under ten years, whole above. */
export const formatTenure = (months) => {
  if (months < 12) return `${months} mo${months === 1 ? '' : 's'}`;
  const years = months / 12;
  const text = years < 10 ? years.toFixed(1).replace(/\.0$/, '') : String(Math.round(years));
  return `${text} yr${text === '1' ? '' : 's'}`;
};
