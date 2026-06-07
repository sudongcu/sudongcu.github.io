import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FULL_TEXT = 'DG.DEV';

const Logo = ({ to = '/', onScrollTop = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!isHovered) {
      setDisplayed('');
      return undefined;
    }
    let index = 0;
    const interval = setInterval(() => {
      if (index <= FULL_TEXT.length) {
        setDisplayed(FULL_TEXT.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [isHovered]);

  const content = (
    <>
      <span className="text-primary-400 text-2xl font-mono group-hover:text-primary-300 transition-colors">
        {'<'}
      </span>
      <span
        className="text-2xl font-bold text-gradient transition-all overflow-hidden inline-block"
        style={{ width: isHovered ? '92px' : '0px' }}
      >
        {displayed}
      </span>
      <span className="text-primary-400 text-2xl font-mono group-hover:text-primary-300 transition-colors">
        {'>'}
      </span>
    </>
  );

  const className = 'flex items-center gap-1 group cursor-pointer';
  const handlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  if (onScrollTop) {
    return (
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={className}
        {...handlers}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className={className} {...handlers}>
      {content}
    </Link>
  );
};

export default Logo;
