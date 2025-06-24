import { useState } from 'react';
import { useSwiper } from './useSwiper';
import { useBreakpoint } from './useBreakpoint';

export const useCarousel = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();
  const { isBeginning, isEnd, handleSlideChange, handleSwiper, goToPrev, goToNext } = useSwiper();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return {
    isHovered,
    isMobile,
    isTablet,
    isBeginning,
    isEnd,
    handleSlideChange,
    handleSwiper,
    goToPrev,
    goToNext,
    handleMouseEnter,
    handleMouseLeave,
    useFixedWidthGrid: isMobile || isTablet,
  };
};