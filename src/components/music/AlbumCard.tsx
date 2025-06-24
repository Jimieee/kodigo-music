import { type FC } from 'react';
import { Play, MoreHorizontal } from 'lucide-react';
import { MusicImage } from '../ui/MusicImage';
import { MusicTitle } from '../ui/MusicTitle';
import { ActionButton } from '../ui/ActionButton';
import { useMusicCard } from '../../hooks/useMusicCard';
import { cn } from '../../utils/cn';
import type { Album } from '../../types/music';

interface AlbumCardProps {
  album: Album;
  className?: string;
  onPlay?: () => void;
  onMore?: () => void;
  onClick?: () => void;
  showYear?: boolean;
}

const AlbumCard: FC<AlbumCardProps> = ({
  album,
  className,
  onPlay,
  onMore,
  onClick,
  showYear = false,
}) => {
  const { handleClick, handlePlay, handleMore } = useMusicCard({
    onClick,
    onPlay,
    onMore
  });

  return (
    <figure
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-lg transition-all duration-200',
        className,
      )}
      onClick={handleClick}
    >
      <div className="relative">
        <MusicImage
          src={album.coverImage || album.imageUrl}
          alt={album.imageAlt || `${album.title} by ${album.artist}`}
          size="square"
          className='hover:brightness-85 transition-all duration-200'
        />

        <ActionButton
          icon={Play}
          onClick={handlePlay}
          aria-label={`Play ${album.title}`}
          variant="overlay"
          className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          fill
        />

        <ActionButton
          icon={MoreHorizontal}
          onClick={handleMore}
          aria-label="More options"
          variant="overlay"
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>

      <figcaption className="pt-1">
        <MusicTitle
          title={album.title}
          artist={showYear ? album.year?.toString() : album.artist}
          explicit={album.explicit || album.hasExplicitContent}
          size="medium"
        />
      </figcaption>
    </figure>
  );
};

export default AlbumCard;