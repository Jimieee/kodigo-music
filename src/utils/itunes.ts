export const getHighResArtwork = (artworkUrl: string): string => {
  return artworkUrl
    .replace("100x100bb", "500x500bb")
    .replace("60x60bb", "500x500bb")
    .replace("30x30bb", "500x500bb");
};
