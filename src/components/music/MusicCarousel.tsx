import { type FC } from 'react';
import { BaseCarousel } from '../ui/BaseCarousel';
import { createGridColumns } from '../../utils/carouselHelpers';
import { useCarousel } from '../../hooks/useCarousel';
import CarouselMusicCard from './CarouselMusicCard';
import type { MusicItem } from '../../types/music';

interface MusicCarouselProps {
  title?: string;
  musicItems: MusicItem[];
}

const MusicCarousel: FC<MusicCarouselProps> = ({ title, musicItems }) => {
  const { useFixedWidthGrid } = useCarousel();

  const columns = createGridColumns(musicItems, useFixedWidthGrid, 1, 2);

  const desktopGrid = columns.length <= 1 && (columns[0] as MusicItem[])?.length <= 2 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {musicItems.map((item, index) => (
        <CarouselMusicCard key={`${item.title}-${index}`} {...item} />
      ))}
    </div>
  ) : null;

  return (
    <BaseCarousel
      title={title || ''}
      titleVariant="large"
      mobileSlideWidth="!w-80 sm:!w-96"
      spaceBetween={useFixedWidthGrid ? 16 : 24}
      useFreeMode={useFixedWidthGrid}
      desktopGrid={desktopGrid}
    >
      {useFixedWidthGrid ? (
        musicItems.map((item, index) => (
          <CarouselMusicCard key={`${item.title}-${index}`} {...item} />
        ))
      ) : (
        (columns as MusicItem[][][]).map((slideColumns, slideIndex) => (
          <div key={`slide-${slideIndex}`} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {(slideColumns as MusicItem[][]).flat().map((item, itemIndex) => (
              <CarouselMusicCard
                key={`${item.title}-${slideIndex}-${itemIndex}`}
                {...item}
              />
            ))}
          </div>
        ))
      )}
    </BaseCarousel>
  );
};

export default MusicCarousel;