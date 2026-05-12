import React, { useRef } from "react";
import { usePlayer } from "@/lib/player";
import { useStickyPlayer } from "@/lib/sticky-player";
import "../routes/routes.css";

export default function CatalogCarousel({
  tracks,
  title = "CATALOGUE",
  ctaTitle,
  ctaSubtitle,
  playLabel,
}: {
  tracks: any[];
  title?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  playLabel?: string;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const player = usePlayer();
  const stickyPlayer = useStickyPlayer();

  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handleTrackClick = (t: any) => {
    player.loadTrack(t);
    stickyPlayer.setCurrentTrack({ id: t.id, title: t.title, artist: t.artist });
    stickyPlayer.setIsPlaying(true);
  };

  return (
    <div className="catalog-carousel-wrapper" style={{ position: "relative" }}>
      <div className="catalog-header">
        <div className="catalog-title">{title}</div>
        <div className="catalog-controls">
          <button aria-label="Previous" className="catalog-arrow" onClick={() => scrollBy(-1)}>‹</button>
          <button aria-label="Next" className="catalog-arrow" onClick={() => scrollBy(1)}>›</button>
        </div>
      </div>

      <div className="catalog-tracks" ref={trackRef}>
        {tracks.map((t) => (
          <div key={t.id} className="track-card" role="button" onClick={() => handleTrackClick(t)}>
            <div className="track-cover">
              <div className="track-play-overlay">▶</div>
            </div>
            <div className="track-info">
              <div className="track-title" title={t.title}>{t.title}</div>
              <div className="track-artist" title={t.artist}>{t.artist}</div>
              <button
                className="track-play-pill button-base button-outline"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrackClick(t);
                }}
              >
                {playLabel ?? "Écouter"}
              </button>
            </div>
          </div>
        ))}

        {/* CTA final slide */}
        <div className="track-card cta-card">
          <div className="cta-content">
            <h3>{ctaTitle ?? "Découvre tous les autres sons"}</h3>
            <p>{ctaSubtitle ?? "Écoute la discographie complète sur SoundCloud ou Spotify."}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <a className="button-base button-accent" href="https://soundcloud.com/antoinelcd" target="_blank" rel="noreferrer">SoundCloud</a>
              <a className="button-base button-outline" href="https://open.spotify.com" target="_blank" rel="noreferrer">Spotify</a>
            </div>
          </div>
        </div>
      </div>

      <div className="catalog-fade-right" aria-hidden="true" />
    </div>
  );
}
