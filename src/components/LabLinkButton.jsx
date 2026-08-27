import { Link } from 'react-router-dom';
import { FlaskConical, ArrowUpRight, ArrowLeft } from 'lucide-react';

const LabLinkButton = ({ to = '/lab', direction = 'forward', onClick, className = '' }) => {
  const isBack = direction === 'back';
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border border-frost/30 bg-frost/5 px-3 py-1.5 text-sm font-medium text-frost transition-all hover:border-frost/60 hover:bg-frost/15 hover:text-ice-50 ${className}`}
    >
      {isBack && <ArrowLeft className="h-3.5 w-3.5" />}
      <FlaskConical className="h-4 w-4" />
      <span>Lab</span>
      {!isBack && <ArrowUpRight className="h-3.5 w-3.5" />}
    </Link>
  );
};

export default LabLinkButton;
