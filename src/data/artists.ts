const DEFAULT_ARTISTS: string[] = [
  "The Weeknd",
  "Rauw Alejandro",
  "Karol G",
  "Ariana Grande",
  "Aria Bela",
  "Rojuu",
  "Stiffy",
  "Rusowsky",
  "La Texana"
] as const;

let artistsToSearch: string[] = [...DEFAULT_ARTISTS];

export const setArtistsToSearch = (artists: string[]): void => {
  artistsToSearch.length = 0;
  artistsToSearch.push(...artists);
};

export const getArtistsToSearch = (): readonly string[] => {
  return [...artistsToSearch];
};

export const resetArtistsToSearch = (): void => {
  artistsToSearch = [...DEFAULT_ARTISTS];
};
