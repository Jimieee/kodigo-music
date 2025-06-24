import { useEffect, useState, type FC } from 'react';
import MusicCarousel from "../components/music/MusicCarousel";
import NewReleasesGrid from "../components/music/NewReleasesGrid";
import SongsGrid from "../components/music/SongsGrid";
import { generateAlbums, generateItems, generateSongs } from "../utils/mock";
import type { MusicItem } from "../types/music";
import type { Album } from "../types/music";
import type { Song } from "../types/music";
import Loading from '../components/common/Loading';
const HomePage: FC = () => {
  const [items, setItems] = useState<MusicItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [latestSongs, setLatestSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [musicItems, albumsData, songsData] = await Promise.all([
          generateItems(6),
          generateAlbums(30),
          generateSongs(36)
        ]);

        setItems(musicItems);
        setAlbums(albumsData);
        setLatestSongs(songsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <MusicCarousel
        title="Featured Music"
        musicItems={items}
      />

      <SongsGrid
        title="Latest Songs"
        songs={latestSongs}
      />

      <NewReleasesGrid
        title="New Releases"
        albums={albums}
      />
    </>
  );
};

export default HomePage;