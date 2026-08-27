import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, EXTERNAL_NAV_LINKS } from '../constants';
import LabLinkButton from './LabLinkButton';

const scrollToId = (id, offset = 96) => {
  const element = document.getElementById(id);
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const isNearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      if (isNearBottom) {
        setActiveSection('contact');
        return;
      }

      const current = NAV_LINKS.map((l) => l.id).find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 140 && rect.bottom >= 140;
      });
      setActiveSection(current ?? '');
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const id = href.replace('#', '');
    if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
    else scrollToId(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto flex items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-xl transition-all duration-500 ${
          isScrolled
            ? 'border-white/10 bg-abyss/70 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]'
            : 'border-white/[0.06] bg-white/[0.03]'
        }`}
      >
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="px-3 font-display text-base font-extrabold tracking-tight text-ice-50"
        >
          DG<span className="text-frost">.</span>DEV
        </a>

        <span className="mx-1 hidden h-5 w-px bg-white/10 md:block" aria-hidden />

        {/* Desktop links */}
        <div className="hidden items-center md:flex">
          {NAV_LINKS.map((link) => {
            const active = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active ? 'text-ice-50' : 'text-ice-200/60 hover:text-ice-50'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{link.title}</span>
              </a>
            );
          })}
        </div>

        <span className="mx-1 hidden h-5 w-px bg-white/10 md:block" aria-hidden />

        <div className="hidden md:block">
          {EXTERNAL_NAV_LINKS.map((link) => (
            <LabLinkButton key={link.id} to={link.href} direction="forward" />
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-full text-ice-200 transition-colors hover:bg-white/10 hover:text-ice-50 md:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass pointer-events-auto absolute left-4 right-4 top-full mt-3 p-2 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                  activeSection === link.id
                    ? 'bg-white/10 text-ice-50'
                    : 'text-ice-200/70 hover:bg-white/5 hover:text-ice-50'
                }`}
              >
                {link.title}
              </a>
            ))}
            <div className="hairline my-2" aria-hidden />
            <div className="px-2 py-1">
              {EXTERNAL_NAV_LINKS.map((link) => (
                <LabLinkButton
                  key={link.id}
                  to={link.href}
                  direction="forward"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
