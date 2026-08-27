import { createContext, useContext } from 'react';
import { SEASONS, getSeasonForDate } from './seasons';

export const SeasonContext = createContext(null);

const AUTO = getSeasonForDate(new Date());

/** Current season plus a setter; works (as auto-only) outside the provider too. */
const useSeason = () => {
  const ctx = useContext(SeasonContext);
  return (
    ctx ?? {
      season: AUTO,
      auto: AUTO,
      override: null,
      setSeason: () => {},
      config: SEASONS[AUTO],
    }
  );
};

export default useSeason;
