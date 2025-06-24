import { type FC } from 'react';
import { BaseCarousel } from '../ui/BaseCarousel';
import { createGridColumns } from '../../utils/carouselHelpers';
import { useCarousel } from '../../hooks/useCarousel';
import AlbumCard from './AlbumCard';
import type { Album } from '../../types/music';

interface NewReleasesGridProps {
  title: string;
  albums: Album[];
  className?: string;
}

const NewReleasesGrid: FC<NewReleasesGridProps> = ({
  title,
  albums,
  className = '',
}) => {
  const { useFixedWidthGrid } = useCarousel();

  const columns = createGridColumns(albums, useFixedWidthGrid, 2, 5);

  const renderAlbumColumn = (columnAlbums: Album[], columnKey: string) => (
    <div key={columnKey} className="space-y-4">
      {columnAlbums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );

  const desktopGrid = columns.length <= 1 ? (
    <div className="grid grid-cols-5 gap-4">
      {(columns[0] as Album[][])?.map((columnAlbums, columnIndex) =>
        renderAlbumColumn(columnAlbums, `column-${columnIndex}`)
      )}
    </div>
  ) : null;

  return (
    <BaseCarousel
      title={title}
      titleVariant="small"
      showChevron={true}
      className={className}
      mobileSlideWidth="!w-40 sm:!w-48"
      spaceBetween={12}
      desktopGrid={desktopGrid}
    >
      {useFixedWidthGrid ? (
        (columns as Album[][]).map((columnAlbums, columnIndex) =>
          renderAlbumColumn(columnAlbums, `fixed-column-${columnIndex}`)
        )
      ) : (
        (columns as Album[][][]).map((slideColumns, slideIndex) => (
          <div key={`slide-${slideIndex}`} className="grid grid-cols-5 gap-4">
            {slideColumns.map((columnAlbums, columnIndex) =>
              renderAlbumColumn(columnAlbums, `slide-${slideIndex}-column-${columnIndex}`)
            )}
          </div>
        ))
      )}
    </BaseCarousel>
  );
};

export default NewReleasesGrid;