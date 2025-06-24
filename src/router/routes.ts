export const ROUTES = {
  HOME: "/",
  SONG: "/song/:id",
  NOT_FOUND: "*",
} as const;

export const generateSongRoute = (id: string | number) => `/song/${id}`;
