import { Button } from "../ui/Button";
import { SkipBack, SkipForward, Play, Pause, Volume2, Music, User, Maximize2 } from 'lucide-react';
import type { FC } from "react";
import { cn } from "../../utils/cn";
import type { CurrentSong } from "../../types/music";
import { formatTime } from "../../utils/time";
import { useSignInModal } from "../../hooks/useSignInModal";
import { SignInModal } from "./SignInModal";

interface TopBarProps {
  onTogglePlay: () => void;
  isPlaying: boolean;
  volume: number;
  onVolumeChange: (volume: number) => void;
  currentSong?: CurrentSong;
  onNowPlayingClick?: () => void;
  progress?: number;
  onNext?: () => void;
  onPrevious?: () => void;
}

const TopBar: FC<TopBarProps> = ({
  onTogglePlay,
  isPlaying,
  volume,
  onVolumeChange,
  currentSong,
  onNowPlayingClick,
  progress = 0,
  onNext,
  onPrevious
}) => {
  const { isModalOpen, openModal, closeModal } = useSignInModal();

  return (
    <>
      <header className="flex items-center justify-between h-16 px-4 bg-card border-b border-border">
        {/* Player Controls */}
        <section className="flex items-center space-x-4" aria-label="Media controls">
          <Button
            variant="ghost"
            className="cursor-pointer"
            size="sm"
            aria-label="Previous track"
            onClick={onPrevious}
            disabled={!currentSong}
          >
            <SkipBack className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            className="cursor-pointer"
            size="sm"
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={!currentSong}
          >
            {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          </Button>
          <Button
            variant="ghost"
            className="cursor-pointer"
            size="sm"
            aria-label="Next track"
            onClick={onNext}
            disabled={!currentSong}
          >
            <SkipForward className="h-4 w-4" aria-hidden="true" />
          </Button>
        </section>

        {/* Now Playing / Placeholder */}
        <section className="flex-1 max-w-md mx-8 flex items-center" aria-label="Now playing">
          {currentSong ? (
            <div className="flex items-center w-full">
              <div
                className="group relative w-12 h-12 flex items-center justify-center bg-muted text-muted-foreground overflow-hidden cursor-pointer"
                onClick={onNowPlayingClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNowPlayingClick?.();
                  }
                }}
              >
                {currentSong.imageUrl ? (
                  <img
                    src={currentSong.imageUrl}
                    alt={`${currentSong.album} cover`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music className="w-5 h-5 z-10 pointer-events-none" />
                )}

                <span
                  className={cn(
                    "absolute inset-0 bg-black/40 transition-opacity duration-200 pointer-events-none",
                    "opacity-0 group-hover:opacity-100"
                  )}
                />

                <Maximize2
                  className={cn(
                    "absolute w-5 h-5 text-white transition-opacity duration-200 z-20 pointer-events-none -scale-x-100",
                    "opacity-0 group-hover:opacity-100"
                  )}
                />
              </div>

              <div
                className="relative flex-1 h-12 bg-secondary/80 px-3 flex flex-col justify-center text-center cursor-pointer hover:bg-secondary transition-colors ml-0"
                onClick={onNowPlayingClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNowPlayingClick?.();
                  }
                }}
              >
                <p className="text-sm text-foreground truncate leading-tight font-medium">
                  {currentSong.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentSong.artist}{currentSong.album && ` — ${currentSong.album}`}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted-foreground/20">
                  <div
                    className="h-full bg-foreground transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="absolute bottom-1 right-2 text-xs text-muted-foreground/80 sm:hidden lg:block">
                  {formatTime(currentSong.currentTime)} / {formatTime(currentSong.duration)}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div
                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={onNowPlayingClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNowPlayingClick?.();
                  }
                }}
              >
                <div
                  className={cn(
                    "group relative w-12 h-12 flex items-center justify-center",
                    "bg-muted text-muted-foreground overflow-hidden"
                  )}
                >
                  <Music className={cn("w-5 h-5 z-10 pointer-events-none")} />

                  <span
                    className={cn(
                      "absolute inset-0 bg-black/40 transition-opacity duration-200 pointer-events-none",
                      "opacity-0 group-hover:opacity-100"
                    )}
                  />

                  <Maximize2
                    className={cn(
                      "absolute w-5 h-5 text-white transition-opacity duration-200 z-20 pointer-events-none -scale-x-100",
                      "opacity-0 group-hover:opacity-100"
                    )}
                  />
                </div>
              </div>
              <div className="flex-1 h-12 bg-muted/60" />
            </>
          )}
        </section>

        {/* Volume Control & Sign In */}
        <section className="flex items-center space-x-4" aria-label="User controls">
          <fieldset className="flex items-center space-x-3 sm:hidden lg:flex">
            <legend className="sr-only">Volume control</legend>
            <Volume2 className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />
            <label className="relative w-20 cursor-pointer">
              <span className="sr-only">Volume</span>
              <span
                className="block w-full h-1 bg-muted rounded-full"
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
                aria-label={`Volume: ${volume}%`}
              />
            </label>
          </fieldset>
          <Button className="cursor-pointer" variant="primary" size="sm" onClick={openModal}>
            <User className="h-4 w-4 mr-2" aria-hidden="true" />
            Sign In
          </Button>
        </section>
      </header>

      <SignInModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default TopBar;