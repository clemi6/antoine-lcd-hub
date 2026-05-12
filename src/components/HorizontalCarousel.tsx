import React, { PropsWithChildren, useRef } from "react";
import "../routes/routes.css";

export default function HorizontalCarousel({
  children,
  rows = 1,
  className = "",
}: PropsWithChildren<{ rows?: 1 | 2; className?: string }>) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div className={`horizontal-carousel hc--rows-${rows} ${className}`} ref={ref}>
      <div className="hc-track" role="list">
        {children}
      </div>
      <div className="hc-fade" aria-hidden="true" />
    </div>
  );
}
