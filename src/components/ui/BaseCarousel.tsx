import { Children, type FC, type ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import SectionWrapper from '../common/SectionWrapper';
import { CarouselNavigation } from './CarouselNavigation';
import { SectionTitle } from './SectionTitle';
import { useCarousel } from '../../hooks/useCarousel';

interface BaseCarouselProps {
  title: string;
  titleVariant?: 'large' | 'small';
  showChevron?: boolean;
  className?: string;
  customPadding?: string;
  children: ReactNode;
  desktopGrid?: ReactNode;
  mobileSlideWidth?: string;
  spaceBetween?: number;
  useFreeMode?: boolean;
}

export const BaseCarousel: FC<BaseCarouselProps> = ({
  title,
  titleVariant = 'small',
  showChevron = false,
  className = '',
  customPadding = undefined,
  children,
  desktopGrid,
  mobileSlideWidth = '!w-80',
  spaceBetween = 16,
  useFreeMode = false,
}) => {
  const carousel = useCarousel();

  return (
    <SectionWrapper
      onMouseEnter={carousel.handleMouseEnter}
      onMouseLeave={carousel.handleMouseLeave}
      className={className}
      customPadding={customPadding}
    >
      <section className="relative">
        <SectionTitle
          title={title}
          variant={titleVariant}
          showChevron={showChevron}
        />

        <div className="relative">
          {carousel.useFixedWidthGrid ? (
            <Swiper
              modules={useFreeMode ? [FreeMode, Navigation] : [Navigation, Pagination]}
              onSwiper={carousel.handleSwiper}
              onSlideChange={carousel.handleSlideChange}
              spaceBetween={spaceBetween}
              slidesPerView="auto"
              freeMode={useFreeMode ? { enabled: true } : undefined}
              centeredSlides={false}
              className="mobile-carousel-swiper"
            >
              {Children.map(children, (child, index) => (
                <SwiperSlide key={index} className={mobileSlideWidth}>
                  <div className="w-full">{child}</div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <>
              {desktopGrid || (
                <Swiper
                  modules={[Navigation, Pagination]}
                  onSwiper={carousel.handleSwiper}
                  onSlideChange={carousel.handleSlideChange}
                  spaceBetween={24}
                  slidesPerView={1}
                  className="desktop-carousel-swiper"
                >
                  {Children.map(children, (child, index) => (
                    <SwiperSlide key={index}>{child}</SwiperSlide>
                  ))}
                </Swiper>
              )}

              <CarouselNavigation
                isHovered={carousel.isHovered}
                isBeginning={carousel.isBeginning}
                isEnd={carousel.isEnd}
                isTablet={carousel.isTablet}
                goToPrev={carousel.goToPrev}
                goToNext={carousel.goToNext}
              />
            </>
          )}
        </div>
      </section>
    </SectionWrapper>
  );
};