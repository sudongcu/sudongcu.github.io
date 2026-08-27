import { useEffect } from 'react';

/**
 * Marks <html data-lab> while the calling page is mounted. index.css resolves
 * the colour tokens under that attribute to the lab's fixed, instrument-lit
 * palette instead of the calendar season (the inline bootstrap in index.html
 * sets it before first paint on /lab routes; this keeps it right on
 * client-side navigation).
 */
const useLabPalette = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-lab', '');
    return () => document.documentElement.removeAttribute('data-lab');
  }, []);
};

export default useLabPalette;
