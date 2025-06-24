import { Play, Pause, MoreHorizontal } from 'lucide-react';
import { ActionButton } from '../ui/ActionButton';
import type { Album, Song } from '../../types/music';
import { usePlayerStore } from '../../store/playerStore';
import { formatTime } from '../../utils/time';
import { cn } from '../../utils/cn';

interface SongTrackListProps {
  album: Album;
}

export const SongTrackList: React.FC<SongTrackListProps> = ({ album }) => {
  const { playSong, currentSong, isPlaying, togglePlayPause } = usePlayerStore();

  const handleTrackPlay = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      playSong(song, album);
    }
  };

  const tracks = album.tracks && album.tracks.length > 0 ? album.tracks : [
    {
      id: album.id,
      title: album.title,
      artist: album.artist,
      artistId: album.artistId,
      duration: 107,
      albumId: album.id,
      trackNumber: 1,
      explicit: album.explicit || false,
      imageUrl: album.imageUrl,
      imageAlt: album.imageAlt
    } as Song
  ];

  return (
    <section className="mt-12 rounded-lg">
      <ul className="space-y-2">
        {tracks.map((track, index) => {
          const isCurrentTrack = currentSong?.id === track.id;
          const isTrackPlaying = isCurrentTrack && isPlaying;
          const isEvenTrack = index % 2 === 0;

          return (
            <li
              key={track.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-md transition-colors group",
                isCurrentTrack
                  ? "bg-primary/10 border border-primary/20"
                  : isEvenTrack
                    ? "bg-secondary/30 hover:bg-secondary/50"
                    : "bg-secondary/1 hover:bg-secondary/50"
              )}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleTrackPlay(track)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center relative cursor-pointer",
                    isCurrentTrack
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {isTrackPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <>
                      <span className={cn(
                        "text-sm font-medium transition-opacity",
                        isCurrentTrack ? "opacity-0" : "group-hover:opacity-0"
                      )}>
                        {index + 1}
                      </span>
                      <Play className={cn(
                        "w-4 h-4 transition-opacity absolute",
                        isCurrentTrack ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )} />
                    </>
                  )}
                </button>
                <div>
                  <p className={`
                    font-medium
                    ${isCurrentTrack ? 'text-primary' : 'text-foreground'}
                  `}>
                    {track.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {track.artist}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <time className="text-sm text-muted-foreground">
                  {formatTime(track?.duration)}
                </time>
                <ActionButton
                  icon={MoreHorizontal}
                  onClick={() => console.log('Track options', track.title)}
                  size="sm"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};