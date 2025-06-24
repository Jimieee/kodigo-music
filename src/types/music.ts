export interface PlayerState {
  isPlaying: boolean;
  currentTrack?: string;
  volume: number;
}

export interface MusicItem {
  id: string;
  title: string;
  artist: string;
  artistId: number;
  audioUrl?: string;
  duration?: number;
  imageUrl: string;
  imageAlt: string;
  explicit?: boolean;
  hasExplicitContent?: boolean;
}

export interface Album extends MusicItem {
  coverImage: string;
  year?: number;
  genre?: string;
  tracks?: MusicItem[];
  releaseDate?: string;
}

export type Song = MusicItem;

export interface MusicCardData extends MusicItem {
  label?: string;
  subtitle?: string;
  description?: string;
  onClick?: () => void;
  className?: string;
}

export interface CurrentSong extends MusicItem {
  album?: string;
  duration?: number;
  currentTime?: number;
  isPlaying?: boolean;
}