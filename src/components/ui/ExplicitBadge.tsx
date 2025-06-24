import React from 'react';
import { cn } from '../../utils/cn';

interface ExplicitBadgeProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export const ExplicitBadge: React.FC<ExplicitBadgeProps> = ({
  variant = 'default',
  className
}) => {
  const variants = {
    default: 'rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground',
    compact: 'text-gray-500 text-xs bg-gray-700 px-1 rounded text-[10px]'
  };

  return (
    <span className={cn(
      'flex-shrink-0',
      variants[variant],
      className
    )}>
      E
    </span>
  );
};
