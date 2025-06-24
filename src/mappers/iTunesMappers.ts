import type { iTunesAlbum, iTunesTrack } from "../types/itunes";
import type { Album, Song } from "../types/music";
import { getHighResArtwork } from "../utils/itunes";
import { millisecondsToSeconds } from "../utils/time";

export const mapTrackToSong = (track: iTunesTrack): Song => ({
  id: track.trackId.toString(),
  title: track.trackName,
  artist: track.artistName,
  artistId: track.artistId,
  audioUrl: track.previewUrl,
  duration: track.trackTimeMillis
    ? millisecondsToSeconds(track.trackTimeMillis)
    : undefined,
  imageUrl: getHighResArtwork(
    track.artworkUrl100 || track.artworkUrl60 || track.artworkUrl30
  ),
  imageAlt: `${track.artistName} – ${track.trackName}`,
  explicit: track.trackExplicitness === "explicit",
  hasExplicitContent:
    track.trackExplicitness === "explicit" ||
    track.collectionExplicitness === "explicit",
});

export const mapAlbumToAlbum = (
  album: iTunesAlbum,
  tracks?: iTunesTrack[]
): Album => ({
  id: album.collectionId.toString(),
  title: album.collectionName,
  artist: album.artistName,
  artistId: album.artistId,
  audioUrl: undefined,
  duration: undefined,
  imageUrl: getHighResArtwork(
    album.artworkUrl100 || album.artworkUrl60 || album.artworkUrl30
  ),
  imageAlt: `Cover of ${album.collectionName}`,
  explicit: album.collectionExplicitness === "explicit",
  hasExplicitContent: album.collectionExplicitness === "explicit",
  coverImage: getHighResArtwork(
    album.artworkUrl100 || album.artworkUrl60 || album.artworkUrl30
  ),
  year: album.releaseDate
    ? new Date(album.releaseDate).getFullYear()
    : undefined,
  genre: album.primaryGenreName,
  tracks: tracks?.map(mapTrackToSong) || [],
  releaseDate: album.releaseDate
    ? new Date(album.releaseDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined,
});

export const mapAlbumTrackToSong = (
  track: iTunesTrack,
  albumName: string
): Song => ({
  ...mapTrackToSong(track),
  imageAlt: `Track ${track.trackName} from ${albumName}`,
});
