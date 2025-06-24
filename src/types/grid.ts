import type { ReactNode } from "react";

export interface GridConfig {
  itemsPerSlide?: number;
  columnsPerSlide?: number;
  itemsPerColumn?: number;
  spaceBetween?: number;
  slidesPerView?: number | 'auto';
  breakpoints?: {
    mobile: Partial<GridConfig>;
    tablet: Partial<GridConfig>;
    desktop: Partial<GridConfig>;
  };
}

export interface GridItem {
  id: string | number;
}

export interface BaseGridProps<T extends GridItem> {
  title?: string;
  items: T[];
  className?: string;
  gridConfig: GridConfig;
  renderItem: (item: T, key: string) => ReactNode;
  showNavigation?: boolean;
  showHeader?: boolean;
}