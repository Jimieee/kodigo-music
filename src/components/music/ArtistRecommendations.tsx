import { useState, useEffect, type FC } from 'react';
import AlbumCard from './AlbumCard';
import { BaseCarousel } from '../ui/BaseCarousel';
import { useCarousel } from '../../hooks/useCarousel';
import type { Album } from '../../types/music';
import { generateRecommendationsForArtist, searchAlbumsByArtistId } from '../../utils/mock';

interface ArtistRecommendationsProps {
  artistName: string;
  artistId: number;
}

export const ArtistRecommendations: FC<ArtistRecommendationsProps> = ({ artistName, artistId }) => {
  const [moreByArtistSongs, setMoreByArtistSongs] = useState<Album[]>([]);
  const [youMightLikeSongs, setYouMightLikeSongs] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { useFixedWidthGrid } = useCarousel();

  const getFirstArtist = (artistName: string): string =>
    artistName
      .replace(/\s*&.*$/, "")
      .trim();

  const slugFirstArtist = getFirstArtist(artistName);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);

      try {
        const moreByArtist = await searchAlbumsByArtistId(artistId, 15);
        setMoreByArtistSongs(moreByArtist);

        const recommendedAlbums = await generateRecommendationsForArtist(slugFirstArtist, 15);
        setYouMightLikeSongs(recommendedAlbums);

      } catch (error) {
        console.error('Error fetching artist recommendations:', error);
        setMoreByArtistSongs([]);
        setYouMightLikeSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (slugFirstArtist) {
      fetchRecommendations();
    }
  }, [slugFirstArtist, artistId]);

  const createSlides = (albums: Album[]) => {
    const slides = [];
    for (let i = 0; i < albums.length; i += 5) {
      slides.push(albums.slice(i, i + 5));
    }
    return slides;
  };

  const renderAlbumSlide = (slideAlbums: Album[], slideKey: string, showYear?: boolean) => (
    <div key={slideKey} className="grid grid-cols-5 gap-4">
      {slideAlbums.map((album) => (
        <AlbumCard
          key={album.id}
          album={album}
          showYear={showYear}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-border/30">
        <div className="px-4 sm:px-6 lg:px-14 py-12">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const moreBySlides = createSlides(moreByArtistSongs);
  const youMightLikeSlides = createSlides(youMightLikeSongs);

  const moreByDesktopGrid = moreBySlides.length <= 1 ? (
    <div className="grid grid-cols-5 gap-4">
      {moreBySlides[0]?.map((album) => (
        <AlbumCard
          key={album.id}
          album={album}
          showYear
        />
      ))}
    </div>
  ) : null;

  const youMightLikeDesktopGrid = youMightLikeSlides.length <= 1 ? (
    <div className="grid grid-cols-5 gap-4">
      {youMightLikeSlides[0]?.map((album) => (
        <AlbumCard
          key={album.id}
          album={album}
        />
      ))}
    </div>
  ) : null;

  return (
    <div className="bg-border/30">
      {moreByArtistSongs.length > 0 && (
        <section>
          <BaseCarousel
            title={`More By ${slugFirstArtist}`}
            titleVariant="small"
            showChevron={true}
            spaceBetween={16}
            mobileSlideWidth="!w-40 sm:!w-48"
            desktopGrid={moreByDesktopGrid}
            customPadding="px-4 sm:px-6 lg:px-14 pt-12 pb-1"
          >
            {useFixedWidthGrid ? (
              moreByArtistSongs.map((album) => (
                <AlbumCard
                  key={`more-fixed-${album.id}`}
                  album={album}
                  showYear
                />
              ))
            ) : (
              moreBySlides.map((slideAlbums, slideIndex) =>
                renderAlbumSlide(slideAlbums, `more-slide-${slideIndex}`, true)
              )
            )}
          </BaseCarousel>
        </section>
      )}

      {youMightLikeSongs.length > 0 && (
        <section className={moreByArtistSongs.length > 0 ? 'mt-8' : ''}>
          <BaseCarousel
            title="You Might Also Like"
            titleVariant="small"
            showChevron={true}
            spaceBetween={16}
            mobileSlideWidth="!w-40 sm:!w-48"
            desktopGrid={youMightLikeDesktopGrid}
            customPadding="px-4 sm:px-6 lg:px-14 pt-12 pb-18 sm:pb-12 lg:pb-16"
          >
            {useFixedWidthGrid ? (
              youMightLikeSongs.map((album) => (
                <AlbumCard
                  key={`recommendation-fixed-${album.id}`}
                  album={album}
                />
              ))
            ) : (
              youMightLikeSlides.map((slideAlbums, slideIndex) =>
                renderAlbumSlide(slideAlbums, `recommendation-slide-${slideIndex}`, false)
              )
            )}
          </BaseCarousel>
        </section>
      )}
    </div>
  );
};