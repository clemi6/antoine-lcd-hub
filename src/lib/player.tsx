import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type Track = { id?: string; title?: string; artist?: string; url: string };

type PlayerContextValue = {
  currentTrack: Track | null;
  isPlaying: boolean;
  loadTrack: (t: Track) => void;
  togglePlay: () => void;
};

const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const scIframeRef = useRef<HTMLIFrameElement | null>(null);
  const scWidgetRef = useRef<any>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // load SoundCloud widget API
  useEffect(() => {
    if (typeof window === "undefined") return;
    if ((window as any).SC && (window as any).SC.Widget) return;
    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const attachWidget = () => {
    const SC = (window as any).SC;
    if (SC && SC.Widget && scIframeRef.current && !scWidgetRef.current) {
      scWidgetRef.current = SC.Widget(scIframeRef.current);
      scWidgetRef.current.bind(SC.Widget.Events.PLAY, () => setIsPlaying(true));
      scWidgetRef.current.bind(SC.Widget.Events.PAUSE, () => setIsPlaying(false));
      scWidgetRef.current.bind(SC.Widget.Events.FINISH, () => setIsPlaying(false));
    }
  };

  useEffect(() => {
    const id = setInterval(() => {
      attachWidget();
    }, 300);
    return () => clearInterval(id);
  }, []);

  const loadTrack = (track: Track) => {
    setCurrentTrack(track);
    const src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
      track.url,
    )}&color=%23c7a575&auto_play=true&visual=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false`;
    if (scIframeRef.current) scIframeRef.current.src = src;
    // try to play when widget is attached
    setTimeout(() => {
      try {
        if (scWidgetRef.current) scWidgetRef.current.play();
      } catch (e) {
        // ignore
      }
    }, 500);
  };

  const togglePlay = () => {
    if (!scWidgetRef.current) return;
    scWidgetRef.current.isPaused((paused: boolean) => {
      if (paused) scWidgetRef.current.play();
      else scWidgetRef.current.pause();
    });
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, loadTrack, togglePlay }}>
      {children}
      {/* Hidden iframe for SC widget */}
      <iframe ref={scIframeRef} title="sc-player" style={{ display: "none" }} />
      {/* Sticky UI */}
      {currentTrack && (
        <div className="sticky-player" aria-live="polite">
          <div className="sticky-player-left">
            <strong className="sticky-track-title">{currentTrack.title}</strong>
            <span className="sticky-track-artist">{currentTrack.artist}</span>
          </div>
          <div className="sticky-player-controls">
            <button type="button" className="button-base" onClick={togglePlay} aria-label="Play/Pause">
              {isPlaying ? "Pause" : "Play"}
            </button>
            <a className="button-base" href={currentTrack.url} target="_blank" rel="noreferrer">
              Ouvrir
            </a>
          </div>
        </div>
      )}
    </PlayerContext.Provider>
  );
}

export default PlayerProvider;
