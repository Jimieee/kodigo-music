import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';
import type { ButtonHTMLAttributes } from 'react';

interface ActionButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  icon: LucideIcon;
  variant?: 'overlay' | 'ghost' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fill?: boolean;
}

export const ActionButton = ({
  icon: Icon,
  variant = 'default',
  size = 'md',
  className,
  fill = false,
  ...rest
}: ActionButtonProps) => {
  const buttonVariants: Record<string, 'ghost' | 'default' | 'primary'> = {
    overlay: 'ghost',
    ghost: 'ghost',
    default: 'primary',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const circularSizes = {
    sm: 'h-8 w-8 min-w-8',
    md: 'h-9 w-9 min-w-9',
    lg: 'h-10 w-10 min-w-10',
  };

  const overlayStyles = variant === 'overlay'
    ? 'bg-black/30 backdrop-blur-sm shadow-lg'
    : '';

  return (
    <Button
      {...rest}
      variant={buttonVariants[variant]}
      size={size}
      className={cn(
        '!rounded-full transition-all duration-200 p-0',
        circularSizes[size],
        overlayStyles,
        className,
      )}
    >
      <Icon
        className={cn(iconSizes[size], fill && 'ml-0.5')}
        fill={fill ? 'currentColor' : 'none'}
      />
    </Button>
  );
};