import { type FC, type MouseEvent } from 'react';
import { MoreHorizontal, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MusicImage } from '../ui/MusicImage';
import { MusicTitle } from '../ui/MusicTitle';
import { ActionButton } from '../ui/ActionButton';
import { generateSongRoute } from '../../router/routes';
import type { Album, Song } from '../../types/music';
import { cn } from '../../utils/cn';
import { usePlayerStore } from '../../store/playerStore';

interface SongCardProps {
  song: Song;
  onMore?: () => void;
  className?: string;
  playlist?: Album;
}

const SongCard: FC<SongCardProps> = ({
  song,
  onMore,
  className,
  playlist
}) => {
  const { isPlaying, currentSong, playSong, togglePlayPause } = usePlayerStore();

  const isCurrentSong = currentSong?.id === song.id;
  const showPlayingState = isCurrentSong && isPlaying;

  const handlePlayPause = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCurrentSong) {
      togglePlayPause();
    } else {
      playSong(song, playlist);
    }
  };

  const handleMore = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMore?.();
  };

  return (
    <article
      className={cn(
        'flex items-center gap-3 p-2 rounded-lg group',
        isCurrentSong && 'bg-primary/5 border border-primary/20',
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <figure className="flex-shrink-0 relative">
          <MusicImage
            src={song.imageUrl}
            alt={song.imageAlt}
            size="small"
            enableTransition={true}
          />
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded cursor-pointer"
            aria-label={
              showPlayingState
                ? `Pause ${song.title}`
                : `Play ${song.title}`
            }
          >
            {showPlayingState ? (
              <Pause
                size={20}
                className="text-white fill-white"
                aria-hidden="true"
              />
            ) : (
              <Play
                size={20}
                className="text-white fill-white"
                aria-hidden="true"
              />
            )}
          </button>
        </figure>

        <Link
          to={generateSongRoute(song.id)}
          className="flex-1"
          aria-label={`Go to song ${song.title} by ${song.artist}`}
          viewTransition
        >
          <MusicTitle
            title={song.title}
            artist={song.artist}
            explicit={song.hasExplicitContent || song.explicit}
            explicitVariant="compact"
            layout="horizontal"
            size="small"
            className={cn(
              'flex-1',
              isCurrentSong && 'text-primary'
            )}
            enableArtistHover={true}
          />
        </Link>
      </div>

      <ActionButton
        icon={MoreHorizontal}
        onClick={handleMore}
        aria-label={`More options for ${song.title}`}
        variant="ghost"
        size="sm"
        fill
      />
    </article>
  );
};

export default SongCard;