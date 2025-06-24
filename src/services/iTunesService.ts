import type { iTunesSearchResponse } from "../types/itunes";

const BASE_URL = "https://itunes.apple.com";

export const lookupById = async (id: string): Promise<iTunesSearchResponse> => {
  const response = await fetch(`${BASE_URL}/lookup?id=${id}`);

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.status}`);
  }

  return response.json();
};

export const lookupAlbumWithTracks = async (
  albumId: string
): Promise<iTunesSearchResponse> => {
  const response = await fetch(
    `${BASE_URL}/lookup?id=${albumId}&entity=song&limit=200`
  );

  if (!response.ok) {
    throw new Error(`Error fetching album data: ${response.status}`);
  }

  return response.json();
};

export const searchTracks = async (
  term: string,
  limit: number = 25
): Promise<iTunesSearchResponse> => {
  const response = await fetch(
    `${BASE_URL}/search?term=${encodeURIComponent(
      term
    )}&entity=song&limit=${limit}&media=music`
  );

  if (!response.ok) {
    throw new Error(`Error searching tracks: ${response.status}`);
  }

  return response.json();
};

export const searchAlbums = async (
  term: string,
  limit: number = 25
): Promise<iTunesSearchResponse> => {
  const response = await fetch(
    `${BASE_URL}/search?term=${encodeURIComponent(
      term
    )}&entity=album&limit=${limit}&media=music`
  );

  if (!response.ok) {
    throw new Error(`Error searching albums: ${response.status}`);
  }

  return response.json();
};

export const lookupAlbumsByArtistId = async (
  artistId: number,
  limit: number = 25
): Promise<iTunesSearchResponse> => {
  const response = await fetch(
    `${BASE_URL}/lookup?id=${artistId}&entity=album&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`Error looking up albums for artist ID ${artistId}: ${response.status}`);
  }

  return response.json();
};