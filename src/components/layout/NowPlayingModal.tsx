import { type FC, useEffect } from 'react';
import { X, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Volume2, ChevronDown } from 'lucide-react';
import type { CurrentSong } from '../../types/music';
import { formatTime } from '../../utils/time';
import { ActionButton } from '../ui/ActionButton';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useColorAnalysis } from '../../hooks/useColorAnalysis';
import { cn } from '../../utils/cn';
import { OrganicBackground } from '../ui/AnimatedBackground';

interface NowPlayingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong?: CurrentSong;
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  progress?: number;
  onSeek: (progressOrTime: number, isProgress?: boolean) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  duration?: number;
  currentTime?: number;
}

export const NowPlayingModal: FC<NowPlayingModalProps> = ({
  isOpen,
  onClose,
  currentSong,
  isPlaying,
  onTogglePlay,
  onSeek,
  volume,
  onVolumeChange,
  progress = 0,
  onNext,
  onPrevious,
  duration = 0,
  currentTime = 0,
}) => {
  const { isTablet } = useBreakpoint();
  const { colors, isLoading } = useColorAnalysis(currentSong?.imageUrl);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleProgressChange = (value: number) => {
    onSeek(value, true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-background backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Animated Background - Solo las partículas animadas */}
      {colors && !isLoading && (
        <OrganicBackground
          colors={colors.palette}
          isPlaying={isPlaying}
          intensity="medium"
          className="z-0"
        />
      )}

      {/* Close Button */}
      <ActionButton
        icon={isTablet ? X : ChevronDown}
        onClick={onClose}
        variant="ghost"
        size="lg"
        className={cn(
          "absolute cursor-pointer z-50 text-foreground hover:bg-accent",
          isTablet
            ? "top-4 right-4 md:top-6 md:left-6"
            : "top-6 left-1/2 transform -translate-x-1/2"
        )}
      />

      <main className="flex flex-col items-center max-w-sm w-full px-4 z-20 relative">
        {/* Album Cover */}
        <section className="w-80 h-80 bg-card border border-border rounded-lg flex items-center justify-center mb-8 overflow-hidden shadow-2xl">
          {currentSong?.imageUrl ? (
            <img
              src={currentSong.imageUrl}
              alt={`${currentSong.title} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-20 h-20 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          )}
        </section>

        {/* Song Info */}
        {currentSong && (
          <header className="text-center mb-6">
            <h1 className="text-xl font-semibold mb-1 text-foreground">
              {currentSong.title}
            </h1>
            <p className="text-muted-foreground">
              {currentSong.artist}
            </p>
          </header>
        )}

        {/* Progress Bar */}
        <section className="w-80 mb-6">
          <div className="flex items-center justify-between text-xs mb-3 text-muted-foreground">
            <time>{formatTime(currentTime)}</time>
            <time>{formatTime(duration)}</time>
          </div>
          <div className="relative">
            <div className="w-full h-1 bg-secondary rounded-full">
              <div
                className="h-1 bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => handleProgressChange(Number(e.target.value))}
              className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
              aria-label="Seek progress"
            />
          </div>
        </section>

        {/* Playback Controls */}
        <section className="flex items-center justify-center space-x-8 mb-8" role="group" aria-label="Playback controls">
          <ActionButton
            icon={Shuffle}
            variant="ghost"
            size="sm"
            aria-label="Shuffle"
            className="cursor-pointer text-foreground hover:bg-accent"
          />
          <ActionButton
            icon={SkipBack}
            onClick={onPrevious}
            disabled={!onPrevious}
            variant="ghost"
            size="md"
            aria-label="Previous track"
            className="cursor-pointer text-foreground hover:bg-accent disabled:text-muted-foreground"
          />
          <ActionButton
            icon={isPlaying ? Pause : Play}
            onClick={onTogglePlay}
            variant="default"
            size="lg"
            fill={!isPlaying}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
          />
          <ActionButton
            icon={SkipForward}
            onClick={onNext}
            disabled={!onNext}
            variant="ghost"
            size="md"
            aria-label="Next track"
            className="cursor-pointer text-foreground hover:bg-accent disabled:text-muted-foreground"
          />
          <ActionButton
            icon={Repeat}
            variant="ghost"
            size="sm"
            aria-label="Repeat"
            className="cursor-pointer text-foreground hover:bg-accent"
          />
        </section>

        {/* Volume Control */}
        <fieldset className="w-80 flex items-center space-x-3 border-0 p-0 m-0">
          <legend className="sr-only">Volume control</legend>
          <Volume2 className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
          <label className="relative flex-1 cursor-pointer">
            <span className="sr-only">Volume</span>
            <span
              className="block w-full h-1 bg-secondary rounded-full"
              aria-hidden="true"
            >
              <span
                className="block h-1 bg-primary rounded-full transition-all duration-300"
                style={{ width: `${volume}%` }}
              />
            </span>
            <input
              type="range"
              min="1"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
            />
          </label>
        </fieldset>
      </main>
    </div>
  );
};