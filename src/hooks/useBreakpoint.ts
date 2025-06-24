import { useEffect, useState } from "react";

interface BreakpointHook {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  is4K: boolean;
  currentBreakpoint: "mobile" | "tablet" | "desktop" | "4k";
}

// this function basically checks if the current window width is less than 768px
// without using any external libraries or css media queries
// only returns a boolean to indicate if the view is mobile or not.
export const useBreakpoint = (): BreakpointHook => {
  const [breakpoint, setBreakpoint] = useState<BreakpointHook>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    is4K: false,
    currentBreakpoint: "desktop",
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024 && width < 1920;
      const is4K = width >= 1920;

      let currentBreakpoint: "mobile" | "tablet" | "desktop" | "4k" = "desktop";

      if (isMobile) currentBreakpoint = "mobile";
      else if (isTablet) currentBreakpoint = "tablet";
      else if (isDesktop) currentBreakpoint = "desktop";
      else if (is4K) currentBreakpoint = "4k";

      setBreakpoint({
        isMobile,
        isTablet,
        isDesktop,
        is4K,
        currentBreakpoint,
      });
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
};
