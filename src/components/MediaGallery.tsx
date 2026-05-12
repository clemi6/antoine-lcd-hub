import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "../routes/routes.css";

type MediaItem = {
  id: string;
  type: "image" | "video";
  src?: string | null;
  poster?: string | null;
  alt?: string;
};

function NoImageSVG() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="3" fill="rgba(255,255,255,0.04)" />
      <path d="M3 3L21 21" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M21 8L14 15L11 12L3 20" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MediaThumbnail({ item, onClick }: { item: MediaItem; onClick: () => void }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(!item.src);
  }, [item.src]);

  return (
    <div className="media-thumb" role="button" onClick={onClick} tabIndex={0}>
      {!hasError && item.type === "image" && (
        <img src={item.src ?? undefined} alt={item.alt ?? ""} onError={() => setHasError(true)} />
      )}

      {!hasError && item.type === "video" && (
        <video muted playsInline preload="metadata" poster={item.poster ?? undefined} onError={() => setHasError(true)}>
          <source src={item.src ?? undefined} />
        </video>
      )}

      {hasError && (
        <div className="media-thumb-fallback">
          <NoImageSVG />
        </div>
      )}

      {item.type === "video" && (
        <div className="media-thumb-play">▶</div>
      )}
    </div>
  );
}

export default function MediaGallery({ items }: { items: MediaItem[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => Math.min(items.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items.length]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [open]);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const close = () => setOpen(false);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(items.length - 1, i + 1));

  return (
    <div className="media-gallery">
      <div className="media-grid">
        {items.map((it, i) => (
          <MediaThumbnail key={it.id} item={it} onClick={() => openAt(i)} />
        ))}
      </div>

      {open && ReactDOM.createPortal(
        <div className="lightbox-overlay" ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) close(); }}>
          <div className="lightbox-body">
            <button className="lightbox-close" onClick={close} aria-label="Close">✕</button>
            <button className="lightbox-prev" onClick={prev} aria-label="Previous">‹</button>
            <div className="lightbox-media">
              {items[index].type === "image" ? (
                <img src={items[index].src ?? undefined} alt={items[index].alt ?? ""} />
              ) : (
                <video src={items[index].src ?? undefined} controls autoPlay playsInline />
              )}
            </div>
            <button className="lightbox-next" onClick={next} aria-label="Next">›</button>
          </div>
        </div>, document.body
      )}
    </div>
  );
}

export { NoImageSVG };
