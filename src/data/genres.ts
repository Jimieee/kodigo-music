export const GENRE_SEARCH_TERMS = {
  Pop: ["pop music", "pop hits", "mainstream pop"],
  Rock: ["rock music", "rock band", "alternative rock"],
  "Hip-Hop/Rap": ["hip hop", "rap music", "urban"],
  "R&B/Soul": ["r&b", "soul music", "contemporary r&b"],
  Electronic: ["electronic music", "edm", "dance"],
  Latin: ["latin music", "reggaeton", "latin pop"],
  Alternative: ["alternative", "indie", "indie rock"],
} as const;

export type GenreKey = keyof typeof GENRE_SEARCH_TERMS;

export const getRandomGenreSearchTerm = (genre: string): string => {
  const terms = GENRE_SEARCH_TERMS[genre as GenreKey] || [genre];
  return terms[Math.floor(Math.random() * terms.length)];
};
