import { useEffect, useMemo, useState } from 'react';
import { SEASONS, SEASON_IDS, getSeasonForDate } from './seasons';
import { SeasonContext } from './useSeason';

const STORAGE_KEY = 'dg.season';
const AUTO = getSeasonForDate(new Date());

// Resolved once at module load (mirrors the inline bootstrap in index.html):
// ?season=… wins, then the stored choice, otherwise the calendar decides.
const readInitialOverride = () => {
  if (typeof window === 'undefined') return null;
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('season');
    if (SEASON_IDS.includes(fromUrl)) return fromUrl;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return SEASON_IDS.includes(stored) ? stored : null;
  } catch {
    return null;
  }
};
const INITIAL_OVERRIDE = readInitialOverride();

const SeasonProvider = ({ children }) => {
  const [override, setOverride] = useState(INITIAL_OVERRIDE);
  const season = override ?? AUTO;

  useEffect(() => {
    document.documentElement.dataset.season = season;
  }, [season]);

  useEffect(() => {
    try {
      if (override) window.localStorage.setItem(STORAGE_KEY, override);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable (private mode) — the choice just won't persist */
    }
  }, [override]);

  const value = useMemo(
    () => ({
      season,
      auto: AUTO,
      override,
      /** Pass a season id to pin it, or null to follow the calendar again. */
      setSeason: setOverride,
      config: SEASONS[season],
    }),
    [season, override],
  );

  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
};

export default SeasonProvider;
