import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

interface CarouselNavigationProps {
  isHovered: boolean;
  isBeginning: boolean;
  isEnd: boolean;
  isTablet: boolean;
  goToPrev: () => void;
  goToNext: () => void;
}

export const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  isHovered,
  isBeginning,
  isEnd,
  isTablet,
  goToPrev,
  goToNext,
}) => {
  if (isTablet) return null;

  const buttonBaseClasses = cn(
    "hidden sm:flex absolute top-1/2 -translate-y-1/2",
    "z-10 h-32 w-10 p-0 items-center justify-center backdrop-blur",
    "bg-background hover:bg-border/90 cursor-pointer",
    "transition-all duration-300 ease-in-out"
  );

  return (
    <>
      <Button
        onClick={goToPrev}
        aria-label="Previous"
        variant="ghost"
        className={cn(
          buttonBaseClasses,
          "-left-12",
          isHovered && !isBeginning
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        onClick={goToNext}
        aria-label="Next"
        variant="ghost"
        className={cn(
          buttonBaseClasses,
          "-right-12",
          isHovered && !isEnd
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </>
  );
};