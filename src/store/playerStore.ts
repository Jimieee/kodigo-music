import { create } from "zustand";
import type { Album, PlayerState, Song } from "../types/music";
import type { Howl } from "howler";
import { calculateTimeFromProgress } from "../utils/time";

interface PlayerStore extends PlayerState {
  currentSong: Song | null;
  playlist: Song[];
  currentIndex: number;
  duration: number;
  currentTime: number;
  isLoading: boolean;
  howlInstance: Howl | null;
  repeatMode: 'none' | 'one' | 'all';
  isShuffleEnabled: boolean;

  playSong: (song: Song, album?: Album) => void;
  pauseSong: () => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  previousSong: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number, shouldSeek?: boolean) => void;
  setDuration: (duration: number) => void;
  setLoading: (loading: boolean) => void;
  setHowlInstance: (howl: Howl | null) => void;
  seekTo: (progressOrTime: number, isProgress?: boolean) => void;
  clearPlayer: () => void;
  onSongEnd: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  toggleShuffle: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  isPlaying: false,
  currentTrack: undefined,
  volume: 80,
  currentSong: null,
  playlist: [],
  currentIndex: -1,
  duration: 0,
  currentTime: 0,
  isLoading: false,
  howlInstance: null,
  repeatMode: 'none',
  isShuffleEnabled: false,

  playSong: (song: Song, album?: Album) => {
    const currentPlaylist =
      album?.tracks && album.tracks.length > 0 ? album.tracks : [song];
    const index = currentPlaylist.findIndex((s) => s.id === song.id);

    set({
      currentSong: song,
      currentTrack: song.id,
      playlist: currentPlaylist,
      currentIndex: index,
      isPlaying: true,
      isLoading: true,
      currentTime: 0,
      duration: 0,
    });
  },

  pauseSong: () => set({ isPlaying: false }),

  togglePlayPause: () => {
    const { isPlaying, currentSong } = get();
    if (currentSong) {
      set({ isPlaying: !isPlaying });
    }
  },

  nextSong: () => {
    const { playlist, currentIndex, isShuffleEnabled } = get();
    
    if (playlist.length === 0) return;
    
    let nextIndex = -1;
    
    if (isShuffleEnabled && playlist.length > 1) {
      // Modo shuffle: selecciona una canción aleatoria diferente a la actual
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (nextIndex === currentIndex);
    } else {
      // Modo normal: siguiente canción
      nextIndex = currentIndex + 1;
      if (nextIndex >= playlist.length) {
        nextIndex = 0; // Volver al inicio si llegamos al final
      }
    }
    
    const nextSong = playlist[nextIndex];
    set({
      currentSong: nextSong,
      currentTrack: nextSong.id,
      currentIndex: nextIndex,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
      isLoading: true,
    });
  },

  previousSong: () => {
    const { playlist, currentIndex, isShuffleEnabled } = get();
    
    if (playlist.length === 0) return;
    
    let prevIndex = -1;
    
    if (isShuffleEnabled && playlist.length > 1) {
      // En modo shuffle, selecciona una canción aleatoria diferente
      do {
        prevIndex = Math.floor(Math.random() * playlist.length);
      } while (prevIndex === currentIndex);
    } else {
      // Modo normal: canción anterior
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = playlist.length - 1; // Ir al final si estamos al inicio
      }
    }
    
    const prevSong = playlist[prevIndex];
    set({
      currentSong: prevSong,
      currentTrack: prevSong.id,
      currentIndex: prevIndex,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
      isLoading: true,
    });
  },

  setVolume: (volume: number) => {
    const { howlInstance } = get();
    if (howlInstance) {
      const safeVolume = Math.max(volume / 100, 0.01);
      howlInstance.volume(safeVolume);
    }
    set({ volume });
  },

  setCurrentTime: (time: number, shouldSeek = false) => {
    if (shouldSeek) {
      if (typeof window !== "undefined" && window.__handleSeek) {
        window.__handleSeek(time);
      }
    } else {
      set({ currentTime: time });
    }
  },

  seekTo: (progressOrTime: number, isProgress = true) => {
    const { duration } = get();

    let timeToSeek: number;
    if (isProgress) {
      timeToSeek = calculateTimeFromProgress(progressOrTime, duration);
    } else {
      timeToSeek = progressOrTime;
    }

    if (typeof window !== "undefined" && window.__handleSeek) {
      window.__handleSeek(timeToSeek);
    }
  },

  setDuration: (duration: number) => set({ duration }),
  setLoading: (isLoading: boolean) => set({ isLoading }),

  setHowlInstance: (howl: Howl | null) => set({ howlInstance: howl }),

  // Nueva función para manejar cuando termina una canción
  onSongEnd: () => {
    const { playlist, currentIndex, repeatMode, isShuffleEnabled } = get();
    
    if (repeatMode === 'one') {
      // Reinicia la canción actual
      set({ currentTime: 0, isPlaying: true });
      if (typeof window !== "undefined" && window.__handleSeek) {
        window.__handleSeek(0);
      }
      return;
    }
    
    // Determinar la siguiente canción
    let nextIndex = -1;
    
    if (isShuffleEnabled && playlist.length > 1) {
      // Modo shuffle: selecciona una canción aleatoria diferente a la actual
      do {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } while (nextIndex === currentIndex && playlist.length > 1);
    } else {
      // Modo normal: siguiente canción
      nextIndex = currentIndex + 1;
    }
    
    // Verificar si hay siguiente canción
    if (nextIndex < playlist.length && nextIndex >= 0) {
      const nextSong = playlist[nextIndex];
      set({
        currentSong: nextSong,
        currentTrack: nextSong.id,
        currentIndex: nextIndex,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        isLoading: true,
      });
    } else if (repeatMode === 'all' && playlist.length > 0) {
      // Repeat all: volver al inicio
      const firstSong = playlist[0];
      set({
        currentSong: firstSong,
        currentTrack: firstSong.id,
        currentIndex: 0,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
        isLoading: true,
      });
    } else {
      // No hay más canciones y no está en repeat all
      set({ 
        isPlaying: false,
        currentTime: 0
      });
    }
  },

  setRepeatMode: (mode: 'none' | 'one' | 'all') => {
    set({ repeatMode: mode });
  },

  toggleShuffle: () => {
    const { isShuffleEnabled } = get();
    set({ isShuffleEnabled: !isShuffleEnabled });
  },

  clearPlayer: () =>
    set({
      isPlaying: false,
      currentSong: null,
      currentTrack: undefined,
      playlist: [],
      currentIndex: -1,
      currentTime: 0,
      duration: 0,
      isLoading: false,
      howlInstance: null,
      repeatMode: 'none',
      isShuffleEnabled: false,
    }),
}));