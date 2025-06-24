import type { Album } from '../../types/music';

interface SongFooterProps {
  album: Album;
}

export const SongFooter: React.FC<SongFooterProps> = ({ album }) => {
  return (
    <footer className="mt-12 space-y-2 text-muted-foreground text-sm">
      <p>{album.releaseDate}</p>
      <p>{album.tracks?.length} Song{album.tracks?.length ? "s" : ""}, 1 minute</p>
      <p>© {`${album.year} ${album.artist}`}</p>
      <a href="#" className="text-primary cursor-pointer">
        Also available in the Example Store ↗
      </a>
    </footer>
  );
};