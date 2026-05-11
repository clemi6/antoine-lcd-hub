import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 900): boolean {
  const isClient = typeof window !== "undefined" && typeof window.matchMedia !== "undefined";
  const getInitial = () => {
    if (!isClient) return false;
    return window.innerWidth < breakpoint;
  };

  const [isMobile, setIsMobile] = useState<boolean>(getInitial);

  useEffect(() => {
    if (!isClient) return;
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      // MediaQueryListEvent for modern, MediaQueryList for older addListener
      const matches = (e as MediaQueryListEvent).matches ?? (e as MediaQueryList).matches;
      setIsMobile(Boolean(matches));
    };

    // initialize
    setIsMobile(mq.matches);

    if (mq.addEventListener) mq.addEventListener("change", handler as EventListener);
    else mq.addListener(handler as (ev: MediaQueryListEvent) => void);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler as EventListener);
      else mq.removeListener(handler as (ev: MediaQueryListEvent) => void);
    };
  }, [breakpoint, isClient]);

  return isMobile;
}
