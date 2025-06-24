import type { Album, Song, MusicCardData } from "../types/music";
import {
  searchAlbumsByArtist,
  searchTracksByArtist,
} from "../repositories/musicRepository";
import { getArtistsToSearch } from "../data/artists";
import { excludeByArtist, removeDuplicatesById, shuffleArray } from "../types/arrayHelpers";

export const generateAlbums = async (count = 12): Promise<Album[]> => {
  try {
    const artists = getArtistsToSearch();
    const albumsPerArtist = Math.ceil(count / artists.length);

    const promises = artists.map((artist) =>
      searchAlbumsByArtist(artist, albumsPerArtist)
    );

    const results = await Promise.all(promises);
    const allAlbums = results.flat();
    const uniqueAlbums = removeDuplicatesById(allAlbums);
    const shuffled = shuffleArray(uniqueAlbums);

    return shuffled.slice(0, count);
  } catch (error) {
    console.error("Error generating albums from iTunes:", error);
    return [];
  }
};

export const generateSongs = async (count = 16): Promise<Song[]> => {
  try {
    const artists = getArtistsToSearch();
    const songsPerArtist = Math.ceil(count / artists.length);

    const promises = artists.map((artist) =>
      searchTracksByArtist(artist, songsPerArtist)
    );

    const results = await Promise.all(promises);
    const allSongs = results.flat();
    const uniqueSongs = removeDuplicatesById(allSongs);
    const shuffled = shuffleArray(uniqueSongs);

    return shuffled.slice(0, count);
  } catch (error) {
    console.error("Error generating songs from iTunes:", error);
    return [];
  }
};

export const generateItems = async (count = 4): Promise<MusicCardData[]> => {
  try {
    const songs = await generateSongs(count);

    return songs.map((song, index) => ({
      id: `item-${song.id}`,
      title: song.title,
      artist: song.artist,
      artistId: song.artistId,
      audioUrl: song.audioUrl,
      duration: song.duration,
      imageUrl: song.imageUrl,
      imageAlt: song.imageAlt,
      explicit: song.explicit,
      hasExplicitContent: song.hasExplicitContent,
      label: index === 0 ? "Spatial Audio" : "Updated Playlist",
      subtitle: song.artist,
      description: `Popular track from ${song.artist}`,
      onClick: undefined,
      className: undefined,
    }));
  } catch (error) {
    console.error("Error generating items from iTunes:", error);
    return [];
  }
};

// TODO: Fix this function, sometimes doesn't return specific artist recommendations
export const generateRecommendationsForArtist = async (
  currentArtist: string,
  count = 10
): Promise<Album[]> => {
  try {
    const allArtists = getArtistsToSearch();
    const filteredArtists = allArtists.filter(
      (artist) => artist.toLowerCase() !== currentArtist.toLowerCase()
    );

    if (filteredArtists.length < 3) {
      const randomAlbums = await generateAlbums(count * 2);
      return excludeByArtist(randomAlbums, currentArtist).slice(0, count);
    }

    const albumsPerArtist = Math.ceil(
      count / Math.min(filteredArtists.length, 4)
    );
    const selectedArtists = shuffleArray(filteredArtists).slice(0, 4);

    const promises = selectedArtists.map((artist) =>
      searchAlbumsByArtist(artist, albumsPerArtist)
    );

    const results = await Promise.all(promises);
    const allRecommendations = results.flat();
    const uniqueRecommendations = removeDuplicatesById(
      excludeByArtist(allRecommendations, currentArtist)
    );
    const shuffled = shuffleArray(uniqueRecommendations);

    return shuffled.slice(0, count);
  } catch (error) {
    console.error(
      `Error generating recommendations for ${currentArtist}:`,
      error
    );

    try {
      const fallbackAlbums = await generateAlbums(count * 2);
      return excludeByArtist(fallbackAlbums, currentArtist).slice(0, count);
    } catch (fallbackError) {
      console.error(
        "Fallback recommendation generation failed:",
        fallbackError
      );
      return [];
    }
  }
};
