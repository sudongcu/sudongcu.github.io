import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { SEASONS, SEASON_IDS } from '../../theme/seasons';
import useSeason from '../../theme/useSeason';

/**
 * Season switch. `dropdown`: one button showing the current season's icon
 * that opens a glass menu. `list`: the four rows inline (mobile menu).
 * Choosing a season pins it (persisted); "Follow the calendar" un-pins it.
 */
const SeasonPicker = ({ variant = 'dropdown', onPick }) => {
  const { season, auto, override, setSeason } = useSeason();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const Current = SEASONS[season].Icon;

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = (id) => {
    setSeason(id);
    setOpen(false);
    onPick?.(id);
  };

  const rows = (
    <ul role="listbox" aria-label="Season theme" className="min-w-[15rem]">
      {SEASON_IDS.map((id) => {
        const { Icon, label, tagline } = SEASONS[id];
        const active = season === id;
        return (
          <li key={id}>
            <button
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => pick(id)}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                active
                  ? 'border-frost/40 bg-frost/15 text-ice-50'
                  : 'border-transparent text-ice-100 hover:border-white/10 hover:bg-white/10'
              }`}
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                  active ? 'bg-frost/25 text-frost' : 'bg-white/10 text-ice-100'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {label}
                  {id === auto && (
                    <span className="rounded-full bg-mint/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-mint">
                      now
                    </span>
                  )}
                </span>
                <span className="block truncate text-[11px] text-ice-200/75">{tagline}</span>
              </span>
              {active && <Check className="h-4 w-4 shrink-0 text-frost" />}
            </button>
          </li>
        );
      })}
      {override && (
        <li className="mt-1 border-t border-white/[0.06] pt-1">
          <button
            type="button"
            onClick={() => {
              setSeason(null);
              setOpen(false);
              onPick?.(null);
            }}
            className="w-full rounded-xl px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-ice-200/70 transition-colors hover:bg-white/10 hover:text-ice-50"
          >
            Follow the calendar
          </button>
        </li>
      )}
    </ul>
  );

  if (variant === 'list') return rows;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Season: ${SEASONS[season].label}`}
        title={`Season: ${SEASONS[season].label}${override ? ' (pinned)' : ' (auto)'}`}
        onClick={() => setOpen((v) => !v)}
        className={`season-glow inline-flex h-9 items-center gap-2 rounded-full border px-3 text-frost transition-colors ${
          open ? 'border-frost/60 bg-frost/20' : 'border-frost/35 bg-frost/10 hover:border-frost/60 hover:bg-frost/20'
        }`}
      >
        <Current className="h-4 w-4" />
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] lg:inline">
          {SEASONS[season].label}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-3 rounded-2xl border border-white/15 bg-deep/95 p-1.5 shadow-[0_28px_70px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgb(var(--c-frost)/0.18),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl"
          >
            <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-frost/80">Season</p>
            {rows}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeasonPicker;
