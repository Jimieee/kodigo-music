import { useEffect, useRef } from "react";
import { Howl, Howler } from "howler";
import { usePlayerStore } from "../store/playerStore";

/* TODO: Fix when an album is playing and you pause track 2 or higher, it plays the first track */
export const useAudioPlayer = () => {
  const howlRef = useRef<Howl | null>(null);
  const shouldPlayRef = useRef<boolean>(false);
  const isSeekingRef = useRef<boolean>(false);
  const seekTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isPlaying,
    currentSong,
    volume,
    setCurrentTime,
    setDuration,
    setLoading,
    setHowlInstance,
    onSongEnd,
    pauseSong,
  } = usePlayerStore();

  const cleanup = () => {
    if (howlRef.current) {
      howlRef.current.unload();
      howlRef.current = null;
    }
    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
      seekTimeoutRef.current = null;
    }
    setHowlInstance(null);
  };

  const handleSeek = (time: number) => {
    if (!howlRef.current) return;

    isSeekingRef.current = true;

    if (seekTimeoutRef.current) {
      clearTimeout(seekTimeoutRef.current);
    }

    setCurrentTime(time, false);

    seekTimeoutRef.current = setTimeout(() => {
      if (howlRef.current && !isNaN(time) && time >= 0) {
        const duration = howlRef.current.duration() || 0;
        const safeTime = Math.min(time, duration);
        howlRef.current.seek(safeTime);
      }
      isSeekingRef.current = false;
    }, 150); // delay (debounce) to avoid excessive seeks
  };

  useEffect(() => {
    if (!currentSong?.audioUrl) return;

    shouldPlayRef.current = isPlaying;

    cleanup();
    setLoading(true);

    const howl = new Howl({
      src: [currentSong.audioUrl],
      html5: true,
      preload: "metadata",
      volume: Math.max(volume / 100, 0.01),
      onload: () => {
        setDuration(howl.duration() || 0);
        setLoading(false);
        if (shouldPlayRef.current) {
          howl.play();
        }
      },
      onloaderror: (error) => {
        console.error("Audio load error:", error);
        setLoading(false);
        pauseSong();
      },
      onplayerror: (error) => {
        console.error("Audio play error:", error);
        setLoading(false);
        pauseSong();
      },
      onend: () => {
        onSongEnd();
      },
      onpause: () => {},
      onplay: () => {},
    });

    howlRef.current = howl;
    setHowlInstance(howl);

    if (typeof window !== "undefined") {
      window.__handleSeek = handleSeek;
    }

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id]);

  useEffect(() => {
    if (!howlRef.current) return;

    if (isPlaying) {
      if (howlRef.current.state() === "loaded") {
        howlRef.current.play();
      }
    } else {
      howlRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (howlRef.current) {
      const safeVolume = Math.max(volume / 100, 0.01);
      howlRef.current.volume(safeVolume);
    }
    Howler.volume(Math.max(volume / 100, 0.01));
  }, [volume]);

  useEffect(() => {
    if (!howlRef.current || !isPlaying) return;

    const updateTime = () => {
      if (howlRef.current && !isSeekingRef.current) {
        const currentTime = (howlRef.current.seek() as number) || 0;
        setCurrentTime(currentTime);
      }
    };

    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, [isPlaying, setCurrentTime]);

  useEffect(() => {
    return () => {
      cleanup();
      if (typeof window !== "undefined") {
        delete window.__handleSeek;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};