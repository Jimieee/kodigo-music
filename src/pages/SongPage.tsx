import { useParams, useNavigate } from 'react-router-dom';
import { type FC, useEffect, useState } from 'react';
import SectionWrapper from '../components/common/SectionWrapper';
import { Button } from '../components/ui/Button';
import { SongHero } from '../components/music/SongHero';
import { SongTrackList } from '../components/music/SongTrackList';
import { ArtistRecommendations } from '../components/music/ArtistRecommendations';
import { SongFooter } from '../components/music/SongFooter';
import { usePlayerStore } from '../store/playerStore';
import type { Song, Album } from '../types/music';
import { getSongWithAlbum } from '../utils/mock';
import Loading from '../components/common/Loading';

const SongPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playSong, currentSong, isPlaying, togglePlayPause } = usePlayerStore();

  const [song, setSong] = useState<Song | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongData = async () => {
      if (!id) {
        setError('ID de canción no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getSongWithAlbum(id);

        if (!result) {
          setError('Canción no encontrada');
          return;
        }

        setSong(result.song);
        setAlbum(result.album || null);
      } catch (err) {
        setError('Error al cargar la canción');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongData();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePlay = () => {
    if (!song) return;

    const trackToPlay = album?.tracks && album.tracks.length > 0
      ? album.tracks.find(track => track.id === song.id) || album.tracks[0]
      : song;

    if (currentSong?.id === trackToPlay.id) {
      togglePlayPause();
    } else {
      playSong(trackToPlay, album || undefined);
    }
  };

  if (loading) {
    return <Loading />
  }

  if (error || !song) {
    return (
      <SectionWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {error || 'Canción no encontrada'}
          </h2>
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-primary hover:text-primary/80"
          >
            Home
          </Button>
        </div>
      </SectionWrapper>
    );
  }

  const displayAlbum = album || {
    id: `single-${song.id}`,
    title: song.title,
    artist: song.artist,
    artistId: song.artistId,
    audioUrl: song.audioUrl,
    duration: song.duration,
    imageUrl: song.imageUrl,
    imageAlt: song.imageAlt,
    explicit: song.explicit,
    hasExplicitContent: song.hasExplicitContent,
    coverImage: song.imageUrl,
    year: undefined,
    genre: undefined,
    tracks: [song],
    releaseDate: undefined,
  };

  const isCurrentSongPlaying = isPlaying;

  return (
    <>
      <SectionWrapper>
        <main className="space-y-12">
          <SongHero
            album={displayAlbum}
            onPlay={handlePlay}
            isPlaying={isCurrentSongPlaying}
          />

          {album && album.tracks && album.tracks.length > 0 && (
            <SongTrackList album={album} />
          )}

          <SongFooter album={displayAlbum} />
        </main>
      </SectionWrapper>
      <ArtistRecommendations artistName={song.artist} artistId={song.artistId} />
    </>
  );
};

export default SongPage;