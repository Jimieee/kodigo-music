import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'ghost' | 'primary';
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-primary hover:text-accent-foreground',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-9 px-4',
    lg: 'h-10 px-6',
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});