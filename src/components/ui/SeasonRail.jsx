import { motion } from 'framer-motion';
import { SEASONS, SEASON_IDS } from '../../theme/seasons';
import useSeason from '../../theme/useSeason';

/**
 * The season dial on the hero: four icons on a vertical rail (desktop) or a
 * horizontal row of chips (mobile). The active season is lit in the accent
 * colour and labelled; the calendar's season carries a small "now" mark.
 */
const SeasonRail = ({ orientation = 'vertical', className = '' }) => {
  const { season, auto, setSeason } = useSeason();
  const vertical = orientation === 'vertical';

  return (
    <div
      role="radiogroup"
      aria-label="Season theme"
      data-orientation={orientation}
      className={`${vertical ? 'flex flex-col items-end gap-2' : 'flex items-center gap-2'} ${className}`}
    >
      {!vertical && (
        <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ice-200/45">Season</span>
      )}
      {SEASON_IDS.map((id) => {
        const { Icon, label } = SEASONS[id];
        const active = season === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={id === auto ? `${label} — current season` : label}
            onClick={() => setSeason(id)}
            className={`group relative flex items-center gap-3 ${vertical ? 'flex-row-reverse' : ''}`}
          >
            <span
              className={`relative grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-all duration-500 ${
                active
                  ? 'season-glow scale-110 border-frost/60 bg-frost/15 text-frost'
                  : 'border-white/10 bg-white/[0.04] text-ice-200/50 hover:border-frost/40 hover:text-ice-50'
              }`}
            >
              {active && (
                <motion.span
                  layoutId={`season-rail-${orientation}`}
                  className="absolute inset-0 rounded-full bg-frost/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon className="relative h-4 w-4" />
              {id === auto && (
                <span
                  aria-hidden
                  className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-mint shadow-[0_0_10px_rgb(var(--c-mint)/0.9)]"
                />
              )}
            </span>
            {vertical && (
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.3em] transition-all duration-500 ${
                  active ? 'translate-x-0 text-frost opacity-100' : 'translate-x-2 text-ice-200/50 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                }`}
              >
                {label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SeasonRail;
