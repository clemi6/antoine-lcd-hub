import { createFileRoute } from "@tanstack/react-router";
import { VipPass } from "@/components/antoine/VipPass";
import { SocialLinks } from "@/components/antoine/SocialLinks";
import { motion } from "framer-motion";
import { Moon, Sun, EnvelopeSimple, CopySimple } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import "./routes.css";
import wankidPhoto1 from "@/assets/ANTOINE_LCD_12-25-55.jpg";
import wankidPhoto2 from "@/assets/ANTOINE_LCD_12-25-56.jpg";
import wankidPhoto3 from "@/assets/ANTOINE_LCD_12-25-6.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const heroPhoto = wankidPhoto3;
const galleryPhotos = [wankidPhoto1, wankidPhoto2];

const artistFacts = [
  { label: "Alias", value: "Antoine LCD -> WANKID" },
  { label: "Style", value: "House / Disco-House / Electro" },
  { label: "Scene", value: "Sets club dynamiques" },
  { label: "Audience", value: "Pres de 10 000 abonnes sur YouTube" },
];

const latestReleases = [
  {
    title: "Dernieres sorties SoundCloud",
    format: "Titres et exclus",
    soundcloudEmbedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/antoinelcd/tracks&color=%23c7a575&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=false",
  },
  {
    title: "Disco Mainstream / Instrumental",
    format: "Catalogue Antoine LCD",
    soundcloudEmbedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/antoinelcd&color=%23c7a575&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=false",
  },
];

const latestVideos = [
  {
    title: "Chaine YouTube @antoinelcd",
    source: "YouTube",
    url: "https://www.youtube.com/@antoinelcd",
    cta: "Voir la chaine",
  },
  {
    title: "Video live set (upload)",
    source: "MP4 Upload",
    url: "",
    cta: "Ajouter une URL video",
  },
];

const uploadedVideos = [
  {
    title: "Aftermovie (upload)",
    src: "",
    poster: wankidPhoto2,
  },
];

const upcomingDates = [
  {
    day: "12",
    month: "APR",
    year: "2026",
    city: "LIMOGES",
    venue: "Squ'art Sessions II",
    organizer: "Association Le Squ'art",
    ticketUrl: "",
  },
  {
    day: "15",
    month: "FEB",
    year: "2026",
    city: "LIMOGES",
    venue: "Squ'art Sessions",
    organizer: "Association Le Squ'art",
    ticketUrl: "",
  },
  {
    day: "27",
    month: "JUL",
    year: "2024",
    city: "DOWNTOWN",
    venue: "D3 - Downtown",
    organizer: "Guest set",
    ticketUrl: "",
  },
];

const bookingEmail = "antoinelcd.contact@gmail.com";

const THEME_KEY = "wankid-theme";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const savedTheme = window.localStorage.getItem(THEME_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function Index() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(bookingEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <main className="app-main is-visible">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="wankid-container"
        >
          <Header
            theme={theme}
            onToggleTheme={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
          />
          <section className="wankid-story-strip">
            <p>
              WANKID (ex Antoine LCD) est un DJ et producteur a l'univers House, Disco-House et
              Electro. Il livre des sets club energiques et y presente ses productions exclusives.
            </p>
            <div className="wankid-facts-grid">
              {artistFacts.map((fact) => (
                <div key={fact.label} className="wankid-fact-item">
                  <span>{fact.label}</span>
                  <strong>{fact.value}</strong>
                </div>
              ))}
            </div>
          </section>
          <section className="wankid-links-section">
            <div className="wankid-section-head">LIENS</div>
            <SocialLinks />
          </section>
          <section className="wankid-audio-section">
            <div className="wankid-section-head">DERNIERS SONS</div>
            <AudioSection />
          </section>
          <section className="wankid-gallery-section">
            <div className="wankid-section-head">SETS ET SOIREES</div>
            <Gallery photos={galleryPhotos} />
          </section>
          <section className="wankid-video-section">
            <div className="wankid-section-head">VIDEOS</div>
            <VideoSection />
          </section>
          <section className="wankid-dates-section">
            <div className="wankid-section-head">PROCHAINES DATES</div>
            <DatesSection />
          </section>
          <section className="wankid-pass-section">
            <div className="wankid-section-head">PRESS ACCESS</div>
            <VipPass theme={theme} />
          </section>
          <section className="wankid-booking-section">
            <div className="wankid-section-head">BOOKING / CONTACT</div>
            <div className="booking-mail-row">
              <button
                type="button"
                className="booking-copy"
                onClick={handleCopyEmail}
                aria-label="Copier l'email dans le presse-papiers"
              >
                <span className="booking-email-text">{bookingEmail}</span>
                <span className="booking-copy-icon">{copied ? "✓" : <CopySimple size={14} />}</span>
              </button>
              <a
                className="booking-mailto"
                href={`mailto:${bookingEmail}`}
                onClick={(e) => e.stopPropagation()}
                aria-label="Ouvrir le client mail"
              >
                <EnvelopeSimple size={16} />
              </a>
            </div>
          </section>
          {copied && (
            <div className="booking-toast" role="status" aria-live="polite">
              Email copié dans le presse-papiers
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function Header({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  return (
    <motion.header
      className="wankid-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="wankid-header-content">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === "light" ? "Activer le mode sombre" : "Activer le mode clair"}
        >
          {theme === "light" ? <Moon size={18} weight="bold" /> : <Sun size={18} weight="bold" />}
          <span>{theme === "light" ? "SOMBRE" : "CLAIR"}</span>
        </button>
        <img src={heroPhoto} alt="WANKID en profil" className="wankid-hero-image" />
        <h1 className="wankid-title">WANKID</h1>
        <p className="wankid-subtitle">DJ / PRODUCTEUR / LIVE SETS</p>
      </div>
    </motion.header>
  );
}

function Gallery({ photos }: { photos: string[] }) {
  return (
    <motion.section
      className="wankid-gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="gallery-grid">
        {photos.map((photo, idx) => (
          <motion.div
            key={idx}
            className="gallery-item"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 + idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <img src={photo} alt={`WANKID ${idx + 1}`} loading="lazy" />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function AudioSection() {
  return (
    <div className="audio-grid">
      {latestReleases.map((release) => (
        <article key={release.title} className="audio-card">
          <div className="audio-meta">
            <h3>{release.title}</h3>
            <span>{release.format}</span>
          </div>
          <iframe
            className="audio-player"
            title={release.title}
            src={release.soundcloudEmbedUrl}
            allow="autoplay"
            loading="lazy"
          />
        </article>
      ))}
    </div>
  );
}

function VideoSection() {
  return (
    <div className="video-grid">
      {latestVideos.map((video) => (
        <article key={video.title} className="video-card">
          <div className="video-cta-frame">
            {video.url ? (
              <a href={video.url} target="_blank" rel="noreferrer" className="video-cta-link">
                {video.cta}
              </a>
            ) : (
              <span className="video-cta-placeholder">{video.cta}</span>
            )}
          </div>
          <div className="video-meta">
            <h3>{video.title}</h3>
            <span>{video.source}</span>
          </div>
        </article>
      ))}

      {uploadedVideos.map((video) => (
        <article key={video.title} className="video-card">
          <div className="video-frame">
            {video.src ? (
              <video controls preload="metadata" poster={video.poster}>
                <source src={video.src} type="video/mp4" />
              </video>
            ) : (
              <div className="video-placeholder">
                <span>Upload MP4</span>
                <p>Ajoute l'URL dans uploadedVideos pour afficher la video.</p>
              </div>
            )}
          </div>
          <div className="video-meta">
            <h3>{video.title}</h3>
            <span>Upload</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function DatesSection() {
  return (
    <div className="dates-list">
      {upcomingDates.map((date) => (
        <article key={`${date.day}-${date.month}-${date.venue}`} className="date-card">
          <div className="date-left">
            <span className="date-day">{date.day}</span>
            <span className="date-month">{date.month}</span>
          </div>
          <div className="date-center">
            <h3>{date.venue}</h3>
            <p>
              {date.city} - {date.month} {date.year}
            </p>
            <p>{date.organizer}</p>
          </div>
          {date.ticketUrl ? (
            <a className="date-ticket" href={date.ticketUrl} target="_blank" rel="noreferrer">
              Tickets
            </a>
          ) : (
            <span className="date-ticket is-disabled">Billetterie a renseigner</span>
          )}
        </article>
      ))}
    </div>
  );
}
