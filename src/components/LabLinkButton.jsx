import { Link } from 'react-router-dom';
import { FlaskConical, ArrowUpRight, ArrowLeft } from 'lucide-react';

const LabLinkButton = ({ to = '/lab', direction = 'forward', onClick, className = '' }) => {
  const isBack = direction === 'back';
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-primary-500/40 text-primary-300 hover:border-primary-400 hover:bg-primary-500/10 hover:text-primary-200 transition-all ${className}`}
    >
      {isBack && <ArrowLeft className="w-3.5 h-3.5" />}
      <FlaskConical className="w-4 h-4" />
      <span>Lab</span>
      {!isBack && <ArrowUpRight className="w-3.5 h-3.5" />}
    </Link>
  );
};

export default LabLinkButton;
