import { Calendar } from 'lucide-react';

interface LogoProps {
  onClick?: () => void;
  className?: string;
}

export default function Logo({ onClick, className = '' }: LogoProps) {
  const baseClasses = 'flex items-center space-x-3';
  const clickableClasses = onClick
    ? 'cursor-pointer hover:opacity-80 transition-opacity'
    : '';

  return (
    <div
      className={`${baseClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      <Calendar className="w-8 h-8 text-purple-600" />
      <span className="font-chewy text-2xl text-gray-800">
        Family Weekly Calendar
      </span>
    </div>
  );
}
