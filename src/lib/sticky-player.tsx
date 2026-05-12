import React, { createContext, useState, useContext, ReactNode } from "react";
import { Play, Pause, X } from "@phosphor-icons/react";

type Track = {
  id: string;
  title: string;
  artist: string;
  url?: string;
};

type PlayerContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (playing: boolean) => void;
  close: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function StickyPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const close = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  return (
    <PlayerContext.Provider value={{ currentTrack, isPlaying, setCurrentTrack, setIsPlaying, close }}>
      {children}
      <StickyPlayer />
    </PlayerContext.Provider>
  );
}

export function useStickyPlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("useStickyPlayer must be used within StickyPlayerProvider");
  }
  return context;
}

function StickyPlayer() {
  const { currentTrack, isPlaying, setIsPlaying, close } = useStickyPlayer();

  if (!currentTrack) return null;

  return (
    <div className="sticky-player">
      <div className="sticky-player-content">
        <div className="sticky-player-cover">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <rect width="24" height="24" rx="2" fill="rgba(255,255,255,0.1)" />
            <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.6)" />
          </svg>
        </div>
        <div className="sticky-player-info">
          <div className="sticky-player-title">{currentTrack.title}</div>
          <div className="sticky-player-artist">{currentTrack.artist}</div>
        </div>
      </div>

      <div className="sticky-player-controls">
        <button
          className="sticky-player-btn"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
        </button>
        <button className="sticky-player-btn" onClick={close} aria-label="Close player">
          <X size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}
