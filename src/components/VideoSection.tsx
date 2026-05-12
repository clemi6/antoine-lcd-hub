import React, { useState } from "react";
import HorizontalCarousel from "./HorizontalCarousel";
import "../routes/routes.css";

type Video = {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  url: string;
};

// Mock data - prepared for YouTube API integration
const mockYouTubeVideos: Video[] = [
  {
    id: "mock-1",
    title: "Studio Session - Deep House Mix",
    thumbnailUrl: "",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "mock-2",
    title: "Live Performance - Club Mix",
    thumbnailUrl: null,
    url: "https://www.youtube.com/embed/jNQXAC9IVRw",
  },
  {
    id: "mock-3",
    title: "Production Breakdown",
    thumbnailUrl: "",
    url: "https://www.youtube.com/embed/9bZkp7q19f0",
  },
  {
    id: "mock-4",
    title: "Exclusive Unreleased Track",
    thumbnailUrl: null,
    url: "https://www.youtube.com/embed/kJQP7kiw9Fk",
  },
  {
    id: "mock-5",
    title: "Disco House Remix",
    thumbnailUrl: "",
    url: "https://www.youtube.com/embed/9bZkp7q19f0",
  },
];

function VideoNoImage() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="2" fill="rgba(255,255,255,0.08)" />
      <path d="M3 3L21 21" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M21 8L14 15L11 12L3 20"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function YouTubeChannelCard() {
  return (
    <div className="video-channel-card" role="article">
      <div className="channel-content">
        <h3 className="channel-title">YOUTUBE CHANNEL</h3>
        <p className="channel-handle">@ANTOINELCD</p>
        <a
          href="https://www.youtube.com/@antoinelcd"
          target="_blank"
          rel="noreferrer"
          className="button-base button-accent"
          style={{ marginTop: "12px" }}
        >
          View Channel
        </a>
      </div>
    </div>
  );
}

function VideoThumbnail({ video, onClick }: { video: Video; onClick: () => void }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="video-card-item" role="button" onClick={onClick} tabIndex={0}>
      <div className="video-thumb-wrapper">
        {!hasError && video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="video-thumb-img"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="video-thumb-fallback">
            <VideoNoImage />
          </div>
        )}
        <div className="video-play-icon">▶</div>
      </div>
      <div className="video-card-title">{video.title}</div>
    </div>
  );
}

export default function VideoSection({
  channelUrl = "https://www.youtube.com/@antoinelcd",
}: {
  channelUrl?: string;
}) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <>
      <HorizontalCarousel rows={2} className="videos-horizontal">
        <YouTubeChannelCard />
        {mockYouTubeVideos.map((video) => (
          <VideoThumbnail key={video.id} video={video} onClick={() => setSelectedVideo(video)} />
        ))}
      </HorizontalCarousel>

      {selectedVideo && (
        <div
          className="video-lightbox-overlay"
          onClick={() => setSelectedVideo(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="video-lightbox-body" onClick={(e) => e.stopPropagation()}>
            <button
              className="video-lightbox-close"
              onClick={() => setSelectedVideo(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="video-lightbox-container">
              <iframe
                width="100%"
                height="100%"
                src={`${selectedVideo.url}?autoplay=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedVideo.title}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
