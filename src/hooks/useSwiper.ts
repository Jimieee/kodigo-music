import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";

interface UseSwiperReturn {
  swiperRef: React.RefObject<SwiperType | null>;
  isBeginning: boolean;
  isEnd: boolean;
  handleSlideChange: (swiper: SwiperType) => void;
  handleSwiper: (swiper: SwiperType) => void;
  goToPrev: () => void;
  goToNext: () => void;
}

export const useSwiper = (): UseSwiperReturn => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState<boolean>(true);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const handleSlideChange = (swiper: SwiperType): void => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSwiper = (swiper: SwiperType): void => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const goToPrev = (): void => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const goToNext = (): void => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  return {
    swiperRef,
    isBeginning,
    isEnd,
    handleSlideChange,
    handleSwiper,
    goToPrev,
    goToNext,
  };
};
