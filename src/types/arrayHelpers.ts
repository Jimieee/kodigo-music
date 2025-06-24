export const shuffleArray = <T>(array: T[]): T[] => {
  return array.sort(() => 0.5 - Math.random());
};

export const removeDuplicatesById = <T extends { id: string }>(
  array: T[]
): T[] => {
  return array.filter(
    (item, index, self) => index === self.findIndex((i) => i.id === item.id)
  );
};

export const excludeByArtist = <T extends { artist: string }>(
  array: T[],
  artistToExclude: string
): T[] => {
  return array.filter(
    (item) => item.artist.toLowerCase() !== artistToExclude.toLowerCase()
  );
};
