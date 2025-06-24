import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SectionTitleProps {
  title: string;
  variant?: 'large' | 'small';
  showChevron?: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  variant = 'small',
  showChevron = false,
}) => {
  if (variant === 'large') {
    return (
      <>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
        <div className="border-t border-border mb-6" />
      </>
    );
  }

  return (
    <div className="flex items-center mb-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {showChevron && (
        <span className="text-gray-400 cursor-pointer hover:text-white">
          <ChevronRight className="ml-4 h-4 w-4" />
        </span>
      )}
    </div>
  );
};