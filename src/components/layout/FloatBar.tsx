import { Music, Pause, Play, SkipForward } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";
import type { CurrentSong } from "../../types/music";

interface FloatBarProps {
  onTogglePlay: () => void;
  onNowPlayingClick?: () => void;
  isPlaying: boolean;
  currentSong?: CurrentSong;
  onNext?: () => void;
  onPrevious?: () => void;
}

const FloatBar = ({
  onTogglePlay,
  onNowPlayingClick,
  isPlaying,
  currentSong,
  onNext,
}: FloatBarProps) => {

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePlay();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNext?.();
  };


  return (
    <div
      onClick={onNowPlayingClick}
      className={cn(
        "fixed bottom-0 left-0 right-0",
        "bg-card/95 backdrop-blur-md",
        "border border-border rounded-xl shadow-lg",
        "p-3 z-40 mx-2 mb-2",
        "cursor-pointer"
      )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0 mr-3">
          {currentSong ? (
            <>
              <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center mr-3 flex-shrink-0 overflow-hidden">
                {currentSong.imageUrl ? (
                  <img
                    src={currentSong.imageUrl}
                    alt={`${currentSong.title} cover`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Music className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {currentSong.title}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center mr-3">
                <Music className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="h-4 bg-muted rounded mb-1"></div>
                <div className="h-3 bg-muted/60 rounded w-2/3"></div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTogglePlay}
            className="w-10 h-10 p-0"
            disabled={!currentSong}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="w-8 h-8 p-0 cursor-pointer"
            disabled={!currentSong}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatBar;