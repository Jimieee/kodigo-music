import React from 'react';
import { BaseCarousel } from '../ui/BaseCarousel';
import { createGridColumns } from '../../utils/carouselHelpers';
import { useCarousel } from '../../hooks/useCarousel';
import SongCard from './SongCard';
import type { Song } from '../../types/music';

interface SongsGridProps {
  title: string;
  songs: Song[];
  className?: string;
}

const SongsGrid: React.FC<SongsGridProps> = ({
  title,
  songs,
  className = '',
}) => {
  const { useFixedWidthGrid } = useCarousel();
  const columns = createGridColumns(songs, useFixedWidthGrid, 4, 3);

  const renderSongColumn = (columnSongs: Song[], columnKey: string) => (
    <div key={columnKey} className="space-y-0">
      {columnSongs.map((song, songIndex) => (
        <div key={song.id}>
          {songIndex > 0 && (
            <div className="border-t border-border my-1" />
          )}
          <SongCard song={song} />
        </div>
      ))}
    </div>
  );

  const desktopGrid = columns.length <= 1 ? (
    <div className="grid grid-cols-3 gap-6">
      {(columns[0] as Song[][])?.map((columnSongs, columnIndex) =>
        renderSongColumn(columnSongs, `column-${columnIndex}`)
      )}
    </div>
  ) : null;

  return (
    <BaseCarousel
      title={title}
      titleVariant="small"
      showChevron={true}
      className={className}
      mobileSlideWidth="!w-72 sm:!w-80"
      spaceBetween={12}
      desktopGrid={desktopGrid}
    >
      {useFixedWidthGrid ? (
        (columns as Song[][]).map((columnSongs, columnIndex) =>
          renderSongColumn(columnSongs, `fixed-column-${columnIndex}`)
        )
      ) : (
        (columns as Song[][][]).map((slideColumns, slideIndex) => (
          <div key={`slide-${slideIndex}`} className="grid grid-cols-3 gap-6">
            {slideColumns.map((columnSongs, columnIndex) =>
              renderSongColumn(columnSongs, `slide-${slideIndex}-column-${columnIndex}`)
            )}
          </div>
        ))
      )}
    </BaseCarousel>
  );
};

export default SongsGrid;