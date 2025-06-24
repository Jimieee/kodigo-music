

export interface iTunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  artistId: number;
  collectionName: string;
  collectionId: number;
  trackTimeMillis: number;
  previewUrl: string;
  artworkUrl100: string;
  artworkUrl60: string;
  artworkUrl30: string;
  trackExplicitness: string;
  collectionExplicitness: string;
  releaseDate: string;
  primaryGenreName: string;
  kind: string;
  wrapperType: string;
}

export interface iTunesAlbum {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artistId: number;
  artworkUrl100: string;
  artworkUrl60: string;
  artworkUrl30: string;
  releaseDate: string;
  primaryGenreName: string;
  trackCount: number;
  collectionExplicitness: string;
  wrapperType: string;
}

export interface iTunesSearchResponse {
  resultCount: number;
  results: (iTunesTrack | iTunesAlbum)[];
}