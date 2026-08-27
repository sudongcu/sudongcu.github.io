import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useLabPalette from './useLabPalette';

/**
 * Frame for every /lab page: the bench rail up top (back link · experiment id
 * and name · a live readout with its LED), the graph-paper bench itself, and a
 * one-line footer. The lab has no weather — see useLabPalette.
 *
 * `readout`: { text, state: 'on' | 'busy' | 'off' } shown at the right of the
 * rail (hidden on narrow screens).
 */
const LED_CLASS = {
  on: 'lab-led lab-led-on',
  busy: 'lab-led lab-led-warn animate-pulse',
  off: 'lab-led',
};

const LabShell = ({
  id,
  name,
  icon: Icon,
  back = '/lab',
  backLabel = 'Lab',
  readout = { text: 'Local · no upload', state: 'on' },
  className = '',
  children,
}) => {
  useLabPalette();

  return (
    <div className={`lab-grid flex min-h-screen flex-col bg-abyss text-ice-100 ${className}`}>
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-abyss/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            to={back}
            className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ice-300 transition-colors hover:text-frost"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </Link>
          <span className="h-5 w-px shrink-0 bg-white/10" aria-hidden />
          <div className="flex min-w-0 items-center gap-3">
            {Icon && <Icon className="h-4 w-4 shrink-0 text-frost" />}
            {id && <span className="lab-label shrink-0 text-frost/80">{id}</span>}
            <span className="truncate font-display text-base font-extrabold tracking-tight text-ice-50">{name}</span>
          </div>
          <div className="ml-auto hidden shrink-0 items-center gap-2 sm:flex">
            <span className={LED_CLASS[readout.state] ?? LED_CLASS.off} aria-hidden />
            <span className="lab-label">{readout.text}</span>
          </div>
        </div>
        <div className="lab-ticks opacity-60" aria-hidden />
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-10 sm:px-6 lg:px-8">{children}</main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="hairline mb-4" aria-hidden />
        <p className="lab-label">DG.DEV Lab · every tool runs inside this tab — nothing is uploaded</p>
      </footer>
    </div>
  );
};

export default LabShell;
