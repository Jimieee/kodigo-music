import type { Album, Song } from "../types/music";
import type { iTunesAlbum, iTunesTrack } from "../types/itunes";
import * as iTunesService from "../services/iTunesService";
import { mapTrackToSong, mapAlbumToAlbum } from "../mappers/iTunesMappers";
import { getRandomGenreSearchTerm } from "../data/genres";

export const getSongWithAlbum = async (
  songId: string
): Promise<{ song: Song; album?: Album | null } | null> => {
  try {
    const data = await iTunesService.lookupById(songId);
    const trackData = data.results.find(
      (result) => result.wrapperType === "track"
    ) as iTunesTrack;

    if (!trackData) return null;

    const song = mapTrackToSong(trackData);

    if (trackData.collectionId) {
      const album = await getCompleteAlbum(trackData.collectionId.toString());
      return { song, album };
    }

    return { song };
  } catch (error) {
    console.error(`Error fetching song with album ${songId}:`, error);
    return null;
  }
};

export const searchTracksByArtist = async (
  artistName: string,
  limit = 25
): Promise<Song[]> => {
  try {
    const data = await iTunesService.searchTracks(artistName, limit);
    const tracks = data.results.filter(
      (result) => result.wrapperType === "track"
    ) as iTunesTrack[];

    return tracks.map(mapTrackToSong);
  } catch (error) {
    console.error(`Error searching tracks for ${artistName}:`, error);
    return [];
  }
};

export const searchAlbumsByArtist = async (
  artistName: string,
  limit = 25
): Promise<Album[]> => {
  try {
    const data = await iTunesService.searchAlbums(artistName, limit);
    const albums = data.results.filter(
      (result) => result.wrapperType === "collection"
    ) as iTunesAlbum[];

    return albums.map((album) => mapAlbumToAlbum(album));
  } catch (error) {
    console.error(`Error searching albums for ${artistName}:`, error);
    return [];
  }
};

export const searchAlbumsByArtistId = async (
  artistId: number,
  limit = 25
): Promise<Album[]> => {
  try {
    const data = await iTunesService.lookupAlbumsByArtistId(artistId, limit);
    const albums = data.results.filter(
      (result) => result.wrapperType === "collection"
    ) as iTunesAlbum[];
    return albums.map((album) => mapAlbumToAlbum(album));
  } catch (error) {
    console.error(`Error searching albums for artist ID ${artistId}:`, error);
    return [];
  }
};

export const getAlbumTracks = async (albumId: string): Promise<Song[]> => {
  try {
    const data = await iTunesService.lookupAlbumWithTracks(albumId);
    const tracks = data.results.filter(
      (result) => result.wrapperType === "track"
    ) as iTunesTrack[];

    return tracks.map(mapTrackToSong);
  } catch (error) {
    console.error(`Error fetching tracks for album ${albumId}:`, error);
    return [];
  }
};

export const getCompleteAlbum = async (
  albumId: string
): Promise<Album | null> => {
  try {
    const data = await iTunesService.lookupAlbumWithTracks(albumId);
    const albumData = data.results.find(
      (result) => result.wrapperType === "collection"
    ) as iTunesAlbum;
    const tracks = data.results.filter(
      (result) => result.wrapperType === "track"
    ) as iTunesTrack[];

    if (!albumData) return null;

    return mapAlbumToAlbum(albumData, tracks);
  } catch (error) {
    console.error(`Error fetching complete album ${albumId}:`, error);
    return null;
  }
};

export const searchSpecificTrack = async (
  trackName: string,
  artistName: string
): Promise<Song | null> => {
  try {
    const searchTerm = `${trackName} ${artistName}`;
    const data = await iTunesService.searchTracks(searchTerm, 10);
    const tracks = data.results.filter(
      (result) => result.wrapperType === "track"
    ) as iTunesTrack[];

    const exactMatch = tracks.find(
      (track) =>
        track.trackName.toLowerCase().includes(trackName.toLowerCase()) &&
        track.artistName.toLowerCase().includes(artistName.toLowerCase())
    );

    if (exactMatch) {
      return mapTrackToSong(exactMatch);
    }

    if (tracks.length > 0) {
      return mapTrackToSong(tracks[0]);
    }

    return null;
  } catch (error) {
    console.error(`Error searching for ${trackName} by ${artistName}:`, error);
    return null;
  }
};

export const searchAlbumsByGenre = async (
  genre: string,
  excludeArtist?: string,
  limit = 25
): Promise<Album[]> => {
  try {
    const searchTerm = getRandomGenreSearchTerm(genre);
    const data = await iTunesService.searchAlbums(searchTerm, limit);
    const albums = data.results.filter(
      (result) => result.wrapperType === "collection"
    ) as iTunesAlbum[];

    let mappedAlbums = albums.map((album) => mapAlbumToAlbum(album));

    if (excludeArtist) {
      mappedAlbums = mappedAlbums.filter(
        (album) => album.artist.toLowerCase() !== excludeArtist.toLowerCase()
      );
    }

    return mappedAlbums;
  } catch (error) {
    console.error(`Error searching albums by genre ${genre}:`, error);
    return [];
  }
};
