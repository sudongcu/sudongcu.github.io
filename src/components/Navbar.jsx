import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS, EXTERNAL_NAV_LINKS } from '../constants';
import LabLinkButton from './LabLinkButton';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  const fullText = 'DG.DEV';

  useEffect(() => {
    if (isLogoHovered) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= fullText.length) {
          setDisplayedText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 80);
      return () => clearInterval(interval);
    } else {
      setDisplayedText('');
    }
  }, [isLogoHovered]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = NAV_LINKS.map(link => link.id);
      
      // Check if we're near the bottom of the page
      const isNearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      
      if (isNearBottom) {
        setActiveSection('contact');
      } else {
        const current = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        if (current) setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-800/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              className="flex items-center gap-1 group cursor-pointer"
            >
              <span className="text-primary-400 text-2xl font-mono group-hover:text-primary-300 transition-colors">{'<'}</span>
              <span className="text-2xl font-bold text-gradient transition-all overflow-hidden inline-block" style={{ width: isLogoHovered ? '92px' : '0px' }}>
                {displayedText}
              </span>
              <span className="text-primary-400 text-2xl font-mono group-hover:text-primary-300 transition-colors">{'>'}</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-3 py-2 text-sm font-medium transition-colors relative group ${
                    activeSection === link.id
                      ? 'text-primary-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.title}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-400 transform origin-left transition-transform ${
                      activeSection === link.id
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              ))}

              <span className="h-5 w-px bg-dark-600" aria-hidden="true" />

              {EXTERNAL_NAV_LINKS.map((link) => (
                <LabLinkButton key={link.id} to={link.href} direction="forward" />
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'max-h-96 opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-800/95 backdrop-blur-md">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                activeSection === link.id
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'text-gray-300 hover:bg-dark-700 hover:text-white'
              }`}
            >
              {link.title}
            </a>
          ))}
          <div className="my-2 border-t border-dark-700" aria-hidden="true" />
          <div className="px-3 py-1">
            {EXTERNAL_NAV_LINKS.map((link) => (
              <LabLinkButton
                key={link.id}
                to={link.href}
                direction="forward"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
