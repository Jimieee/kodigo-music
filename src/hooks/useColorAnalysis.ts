import { useState, useEffect } from "react";
import { Vibrant } from "node-vibrant/browser";
import type { Palette, Swatch } from "@vibrant/color";

export interface ColorPalette {
  dominant: string;
  palette: string[];
  isDark: boolean;
  vibrant: string | null;
  muted: string | null;
  darkVibrant: string | null;
  darkMuted: string | null;
  lightVibrant: string | null;
  lightMuted: string | null;
  titleTextColor: string;
  bodyTextColor: string;
}

interface UseColorAnalysisReturn {
  colors: ColorPalette | null;
  isLoading: boolean;
  error: string | null;
}

export const useColorAnalysis = (
  imageUrl?: string
): UseColorAnalysisReturn => {
  const [colors, setColors] = useState<ColorPalette | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDarkColor = (hex: string): boolean => {
    const cleanHex = hex.replace("#", "");
    const [r, g, b] = [0, 2, 4].map((i) =>
      parseInt(cleanHex.slice(i, i + 2), 16)
    );
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  const swatchHex = (swatch: Swatch | null | undefined): string | null =>
    swatch?.hex ?? null;

  const analyzeColors = async (src: string): Promise<ColorPalette> => {
    const palette: Palette = await Vibrant.from(src).getPalette();

    const orderedSwatches: Array<[string, Swatch | null | undefined]> = [
      ["vibrant", palette.Vibrant],
      ["muted", palette.Muted],
      ["darkVibrant", palette.DarkVibrant],
      ["darkMuted", palette.DarkMuted],
      ["lightVibrant", palette.LightVibrant],
      ["lightMuted", palette.LightMuted],
    ];

    const dominantSwatch =
      orderedSwatches.find(([, s]) => s)?.[1] ?? null /* fallback */;

    const dominant = dominantSwatch?.hex ?? "#000000";

    return {
      dominant,
      palette: orderedSwatches.map(([, s]) => swatchHex(s)).filter(Boolean) as string[],
      isDark: isDarkColor(dominant),
      vibrant: swatchHex(palette.Vibrant),
      muted: swatchHex(palette.Muted),
      darkVibrant: swatchHex(palette.DarkVibrant),
      darkMuted: swatchHex(palette.DarkMuted),
      lightVibrant: swatchHex(palette.LightVibrant),
      lightMuted: swatchHex(palette.LightMuted),
      titleTextColor: dominantSwatch?.titleTextColor ?? "#FFFFFF",
      bodyTextColor: dominantSwatch?.bodyTextColor ?? "#FFFFFF",
    };
  };

  useEffect(() => {
    if (!imageUrl) {
      setColors(null);
      return;
    }

    let isActive = true;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const palette = await analyzeColors(imageUrl);
        if (isActive) setColors(palette);
      } catch (e) {
        if (isActive)
          setError(
            e instanceof Error ? e.message : "Failed to analyze colors"
          );
      } finally {
        if (isActive) setIsLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  return { colors, isLoading, error };
};
