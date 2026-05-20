import { useEffect, useState } from "react";

export type Viewport = "mobile" | "tablet" | "desktop";

const MOBILE_MAX = "(max-width: 599.98px)";
const TABLET_RANGE = "(min-width: 600px) and (max-width: 1023.98px)";
const DESKTOP_MIN = "(min-width: 1024px)";

function detect(): Viewport {
  if (typeof window === "undefined") return "desktop";
  if (window.matchMedia(MOBILE_MAX).matches) return "mobile";
  if (window.matchMedia(TABLET_RANGE).matches) return "tablet";
  return "desktop";
}

export function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>(detect);

  useEffect(() => {
    const m1 = window.matchMedia(MOBILE_MAX);
    const m2 = window.matchMedia(TABLET_RANGE);
    const m3 = window.matchMedia(DESKTOP_MIN);
    const update = () => setVp(detect());
    m1.addEventListener("change", update);
    m2.addEventListener("change", update);
    m3.addEventListener("change", update);
    return () => {
      m1.removeEventListener("change", update);
      m2.removeEventListener("change", update);
      m3.removeEventListener("change", update);
    };
  }, []);

  return vp;
}

export function useIsMobile(): boolean {
  return useViewport() === "mobile";
}

export function useIsDesktop(): boolean {
  return useViewport() === "desktop";
}
