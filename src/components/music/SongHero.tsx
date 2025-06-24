import { Play, Pause, MoreHorizontal } from 'lucide-react';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { ExplicitBadge } from '../ui/ExplicitBadge';
import { Button } from '../ui/Button';
import { ActionButton } from '../ui/ActionButton';
import { MusicImage } from '../ui/MusicImage';
import { cn } from '../../utils/cn';
import type { Album } from '../../types/music';
import type { FC } from 'react';

interface SongHeroProps {
  album: Album;
  onPlay: () => void;
  isPlaying?: boolean;
}

export const SongHero: FC<SongHeroProps> = ({ album, onPlay, isPlaying = false }) => {
  const { isMobile } = useBreakpoint();

  return (
    <article className={`flex ${isMobile ? 'flex-col' : 'items-end'} gap-8`}>
      <figure className={cn(
        "aspect-square bg-card rounded-lg overflow-hidden shadow-2xl",
        isMobile
          ? "w-full max-w-sm mx-auto mb-8"
          : "w-64 h-64 flex-shrink-0"
      )}>
        <MusicImage
          src={album.imageUrl}
          alt={`${album.title}${isMobile ? ' - Single' : ''}`}
          className="w-full h-full object-cover"
          songId={album.id}
          enableTransition={true}
          style={{
            viewTransitionName: album.id ? `song-image-${album.id}` : 'none',
            contain: 'layout'
          }}
        />
      </figure>

      <section className={cn(
        "space-y-4",
        isMobile ? "text-center" : "flex-1 pb-4"
      )}>
        <header className="space-y-2">
          <h1 className={cn(
            "font-bold text-foreground leading-none tracking-tight",
            isMobile ? "text-4xl" : "text-3xl"
          )}>
            {album.title}{isMobile ? ' - Single' : ''}
          </h1>
          <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
            <span className={cn(
              "text-primary font-medium",
              isMobile ? "text-xl" : "text-2xl"
            )}>
              {album.artist}
            </span>
            {album.explicit && <ExplicitBadge />}
          </div>
        </header>

        <p className="text-muted-foreground text-sm">
          {album.genre} • {album.year ? album.year : 'Unknown Year'}
        </p>

        <div className={`flex items-center gap-4 pt-4 ${isMobile ? 'justify-center' : ''}`}>
          <Button
            onClick={onPlay}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 font-medium cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 mr-2 fill-current" />
            ) : (
              <Play className="w-4 h-4 mr-2 fill-current" />
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          {!isMobile && (
            <div className="ml-auto">
              <ActionButton
                icon={MoreHorizontal}
                onClick={() => console.log('More options')}
                className="bg-secondary/50 hover:bg-secondary text-foreground"
              />
            </div>
          )}
        </div>
      </section>
    </article>
  );
};