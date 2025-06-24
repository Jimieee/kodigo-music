import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  variant?: 'large' | 'medium';
  showChevron?: boolean;
  onChevronClick?: () => void;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  variant = 'medium',
  showChevron = false,
  onChevronClick,
  className = '',
}) => {
  if (variant === 'large') {
    return (
      <div className={className}>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
        <div className="border-t border-border mb-6"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center mb-4 ${className}`}>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {showChevron && (
        <span
          className="text-gray-400 cursor-pointer hover:text-white"
          onClick={onChevronClick}
        >
          <ChevronRight className="ml-4 h-4 w-4" />
        </span>
      )}
    </div>
  );
};