import { createFileRoute } from "@tanstack/react-router";
import { VipPass } from "@/components/antoine/VipPass";
import { SocialLinks } from "@/components/antoine/SocialLinks";
import { AnimatePresence, motion } from "framer-motion";
import {
  Moon,
  Sun,
  EnvelopeSimple,
  CopySimple,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { useEffect, useState, type CSSProperties } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import "./routes.css";
import wankidPhoto3 from "@/assets/ANTOINE_LCD_12-25-6.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const heroPhoto = wankidPhoto3;
const contentBackgroundStyle: CSSProperties = {
  ["--content-bg-image" as string]: `url(${heroPhoto})`,
};

const artistFacts = [
  { key: "alias", value: "Antoine LCD → WANKID" },
  { key: "style", value: "House / Disco-House / Electro" },
  { key: "scene", value: { fr: "Sets club dynamiques", en: "Dynamic club sets" } },
  {
    key: "audience",
    value: { fr: "Près de 10 000 abonnés sur YouTube", en: "Nearly 10,000 YouTube subscribers" },
  },
] as const;

const latestReleases = [
  {
    titleKey: "latest_releases_title",
    formatKey: "latest_releases_subtitle",
    soundcloudEmbedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/antoinelcd/tracks&color=%23c7a575&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=false",
  },
  {
    titleKey: "main_catalog_title",
    formatKey: "main_catalog_subtitle",
    soundcloudEmbedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/antoinelcd&color=%23c7a575&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=false",
  },
];

const catalogTracks = [
  {
    id: "featured-1",
    title: "GAZA SLIM & VYBZ KARTEL - One man (Antoine LCD & Badsam Remix)",
    artist: "BADSAM, ANTOINE LCD",
    year: "2025",
    url: "https://soundcloud.com/djbadsam/gaza-slim-vybz-kartel-one-1?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
  },
  {
    id: "featured-2",
    title: "COLLATERAL DRIFT (ANTOINE LCD EDIT)",
    artist: "TEEJAY X BURNA BOY",
    year: "2025",
    url: "https://soundcloud.com/antoinelcd/collateral-drift-edit-by-antoinelcd?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
  },
  {
    id: "featured-3",
    title: "BELIEVE IT (ANTOINE LCD EDIT)",
    artist: "DINOS X RIHANNA, PARTYNEXTDOOR",
    year: "2024",
    url: "https://soundcloud.com/antoinelcd/believe-it-edit-by-antoinelcd",
  },
  {
    id: "featured-4",
    title: "SALE HISTOIRE (ANTOINE LCD EDIT)",
    artist: "RSKO",
    year: "2024",
    url: "https://soundcloud.com/antoinelcd/sal-histoire-edit-by-antoinelcd",
  },
  {
    id: "featured-5",
    title: "NOUS DEUX (ANTOINE LCD EDIT)",
    artist: "SDM",
    year: "2024",
    url: "https://soundcloud.com/antoinelcd/nous-deux-edit-by-antoinelcd",
  },
  {
    id: "featured-6",
    title: "MÉCHANTE (ANTOINE LCD EDIT)",
    artist: "AYA NAKAMURA",
    year: "2024",
    url: "https://soundcloud.com/antoinelcd/mechante-edit-by-antoinelcd",
  },
  {
    id: "featured-7",
    title: "DODO X NESESARI (ANTOINE LCD EDIT)",
    artist: "TAYC X KIZZ DANIEL",
    year: "2024",
    url: "https://soundcloud.com/antoinelcd/dodo-nesesari-edit-by-antoinelcd",
  },
  {
    id: "featured-8",
    title: "THE SCOTTS (ANTOINE LCD EDIT)",
    artist: "TRAVIS SCOTT, KID CUDI",
    year: "2024",
    url: "https://soundcloud.com/antoinelcd/thescotts-edit-by-antoinelcd",
  },
  {
    id: "featured-9",
    title: "GUAPA (ANTOINE LCD EDIT)",
    artist: "GUY2BEZBAR",
    year: "2024",
    url: "https://soundcloud.com/antoinelcd/guapa-edit-by-antoinelcd",
  },
  {
    id: "featured-10",
    title: "TIKI TAKA X DEUX FRÈRES (ANTOINE LCD EDIT)",
    artist: "VACRA X PNL",
    year: "2024",
    url: "https://soundcloud.com/antoinelcd/tiki-taka-deux-freres-edit-by-antoinelcd",
  },
  {
    id: "featured-11",
    title: "JACK FUEGO (ANTOINE LCD EDIT)",
    artist: "SDM, PLK",
    year: "2024",
    url: "https://soundcloud.com/antoinelcd/jack-fuego-remix-by-antoinelcd",
  },
];

const latestVideos = [
  {
    titleKey: "youtube_channel_title",
    source: "YouTube",
    url: "https://www.youtube.com/@antoinelcd",
    ctaKey: "youtube_channel_cta",
  },
];

const upcomingDates = [
  {
    day: "12",
    month: "APR",
    year: "2026",
    city: "MULHOUSE",
    venue: "Squ'art Sessions II",
    organizer: "Association Le Squ'art",
    ticketUrl: "",
  },
  {
    day: "15",
    month: "FEB",
    year: "2026",
    city: "MULHOUSE",
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

const translations: Record<string, Record<string, string>> = {
  fr: {
    bio: "WANKID (ex Antoine LCD) est un DJ et producteur à l'univers House, Disco-House et Electro. Il livre des sets club énergiques et y présente ses productions exclusives.",
    subtitle: "DJ / PRODUCTEUR / LIVE SETS",
    links: "LIENS",
    latest_tracks: "DERNIERS SONS",
    sets_and_gigs: "SETS ET SOIRÉES",
    videos: "VIDÉOS",
    upcoming_dates: "PROCHAINES DATES",
    press_access: "PRESS ACCESS",
    booking_contact: "BOOKING / CONTACT",
    copy_aria: "Copier l'email dans le presse-papiers",
    open_mail_aria: "Ouvrir le client mail",
    copied_toast: "Email copié dans le presse-papiers",
    latest_releases_title: "DERNIÈRES SORTIES SOUNDCLOUD",
    latest_releases_subtitle: "Titres et exclus",
    main_catalog_title: "DISCO MAINSTREAM / INSTRUMENTAL",
    main_catalog_subtitle: "Catalogue Antoine LCD",
    youtube_channel_title: "CHAÎNE YOUTUBE @ANTOINELCD",
    youtube_channel_cta: "VOIR LA CHAÎNE",
    catalog_previous: "Page précédente",
    catalog_next: "Page suivante",
    catalog_play: "ÉCOUTER",
    tickets: "BILLETTERIE",
    ticket_placeholder: "Billetterie à renseigner",
    theme_light_aria: "Activer le mode clair",
    theme_dark_aria: "Activer le mode sombre",
    lang_fr_aria: "Basculer en français",
    lang_en_aria: "Basculer en anglais",
    theme_light: "CLAIR",
    theme_dark: "SOMBRE",
    alias: "Alias",
    style: "Style",
    scene: "Scène",
    audience: "Audience",
    catalog: "CATALOGUE",
    track_year: "Année",
  },
  en: {
    bio: "WANKID (formerly Antoine LCD) is a DJ and producer working in House, Disco-House and Electro. He delivers energetic club sets and showcases exclusive productions.",
    subtitle: "DJ / PRODUCER / LIVE SETS",
    links: "LINKS",
    latest_tracks: "LATEST TRACKS",
    sets_and_gigs: "SETS & GIGS",
    videos: "VIDEOS",
    upcoming_dates: "UPCOMING DATES",
    press_access: "PRESS ACCESS",
    booking_contact: "BOOKING / CONTACT",
    copy_aria: "Copy email to clipboard",
    open_mail_aria: "Open mail client",
    copied_toast: "Email copied to clipboard",
    latest_releases_title: "LATEST SOUNDCLOUD RELEASES",
    latest_releases_subtitle: "Tracks and exclusives",
    main_catalog_title: "MAINSTREAM DISCO / INSTRUMENTAL",
    main_catalog_subtitle: "Antoine LCD catalog",
    youtube_channel_title: "YOUTUBE CHANNEL @ANTOINELCD",
    youtube_channel_cta: "VIEW CHANNEL",
    catalog_previous: "Previous page",
    catalog_next: "Next page",
    catalog_play: "PLAY",
    tickets: "TICKETS",
    ticket_placeholder: "Ticketing to be added",
    theme_light_aria: "Enable light mode",
    theme_dark_aria: "Enable dark mode",
    lang_fr_aria: "Switch to French",
    lang_en_aria: "Switch to English",
    theme_light: "LIGHT",
    theme_dark: "DARK",
    alias: "Alias",
    style: "Style",
    scene: "Scene",
    audience: "Audience",
    catalog: "CATALOG",
    track_year: "Year",
  },
};

const THEME_KEY = "wankid-theme";

const catalogPageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
  }),
};

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
  const [catalogPage, setCatalogPage] = useState(0);
  const [catalogDirection, setCatalogDirection] = useState(1);
  const isMobile = useIsMobile(768);
  const [lang, setLang] = useState<"fr" | "en">(() => {
    if (typeof window === "undefined") return "en";
    return navigator.language && navigator.language.startsWith("fr") ? "fr" : "en";
  });

  const t = (key: string) => translations[lang]?.[key] ?? key;

  const tracksPerPage = isMobile ? 2 : 4;
  const catalogPageCount = Math.ceil(catalogTracks.length / tracksPerPage);
  const visibleCatalogTracks = catalogTracks.slice(
    catalogPage * tracksPerPage,
    catalogPage * tracksPerPage + tracksPerPage,
  );

  useEffect(() => {
    setCatalogPage((prev) => Math.min(prev, catalogPageCount - 1));
  }, [catalogPageCount]);

  const paginateCatalog = (nextDirection: 1 | -1) => {
    setCatalogDirection(nextDirection);
    setCatalogPage((prev) => {
      const nextPage = prev + nextDirection;
      if (nextPage < 0) return catalogPageCount - 1;
      if (nextPage >= catalogPageCount) return 0;
      return nextPage;
    });
  };

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
    <div className="app-shell" style={contentBackgroundStyle}>
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
            lang={lang}
            onToggleLang={() => setLang((prev) => (prev === "fr" ? "en" : "fr"))}
          />
          <section className="wankid-story-strip">
            <p>{translations[lang].bio}</p>
            <div className="wankid-facts-grid">
              {artistFacts.map((fact) => (
                <div key={fact.key} className="wankid-fact-item">
                  <span>{translations[lang][fact.key]}</span>
                  <strong>{typeof fact.value === "string" ? fact.value : fact.value[lang]}</strong>
                </div>
              ))}
            </div>
          </section>
          <section className="wankid-links-section">
            <div className="wankid-section-head">{translations[lang].links}</div>
            <SocialLinks />
          </section>
          <section className="wankid-audio-section">
            <div className="wankid-section-head">{translations[lang].latest_tracks}</div>
            <AudioSection lang={lang} />
          </section>
          <section className="wankid-catalog-section">
            <div className="catalog-topbar">
              <div className="wankid-section-head">{translations[lang].catalog}</div>
              <div className="catalog-nav">
                <button
                  type="button"
                  className="catalog-arrow"
                  onClick={() => paginateCatalog(-1)}
                  aria-label={translations[lang].catalog_previous}
                >
                  <CaretLeft size={18} weight="bold" />
                </button>
                <span className="catalog-page-count">
                  {catalogPage + 1} / {catalogPageCount}
                </span>
                <button
                  type="button"
                  className="catalog-arrow"
                  onClick={() => paginateCatalog(1)}
                  aria-label={translations[lang].catalog_next}
                >
                  <CaretRight size={18} weight="bold" />
                </button>
              </div>
            </div>
            <div className="catalog-carousel">
              <AnimatePresence mode="wait" initial={false} custom={catalogDirection}>
                <motion.div
                  key={catalogPage}
                  className="catalog-grid catalog-grid--carousel"
                  custom={catalogDirection}
                  variants={catalogPageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {visibleCatalogTracks.map((track) => (
                    <a
                      key={track.id}
                      className="catalog-card"
                      href={track.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${track.title} ${track.artist} ${track.year}`}
                    >
                      <div className="catalog-art">
                        <span className="catalog-art-label">SC</span>
                      </div>
                      <div className="catalog-meta">
                        <h4>{track.title}</h4>
                        <p>{track.artist}</p>
                        <span className="catalog-year">{track.year}</span>
                      </div>
                      <span className="catalog-play">{translations[lang].catalog_play}</span>
                    </a>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
          <section className="wankid-video-section">
            <div className="wankid-section-head">{translations[lang].videos}</div>
            <VideoSection lang={lang} />
          </section>
          <section className="wankid-dates-section">
            <div className="wankid-section-head">{translations[lang].upcoming_dates}</div>
            <DatesSection lang={lang} />
          </section>
          <section className="wankid-pass-section">
            <div className="wankid-section-head">{translations[lang].press_access}</div>
            <VipPass theme={theme} />
          </section>
          <section className="wankid-booking-section">
            <div className="wankid-section-head">{translations[lang].booking_contact}</div>
            <div className="booking-mail-row">
              <button
                type="button"
                className="booking-copy"
                onClick={handleCopyEmail}
                aria-label={translations[lang].copy_aria}
              >
                <span className="booking-email-text">{bookingEmail}</span>
                <span className="booking-copy-icon">{copied ? "✓" : <CopySimple size={14} />}</span>
              </button>
              <a
                className="booking-mailto"
                href={`mailto:${bookingEmail}`}
                onClick={(e) => e.stopPropagation()}
                aria-label={translations[lang].open_mail_aria}
              >
                <EnvelopeSimple size={16} />
              </a>
            </div>
          </section>
          {copied && (
            <div className="booking-toast" role="status" aria-live="polite">
              {translations[lang].copied_toast}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function Header({
  theme,
  onToggleTheme,
  lang,
  onToggleLang,
}: {
  theme: Theme;
  onToggleTheme: () => void;
  lang: "fr" | "en";
  onToggleLang: () => void;
}) {
  return (
    <motion.header
      className="wankid-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="wankid-header-content">
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={
              theme === "light"
                ? translations[lang].theme_dark_aria
                : translations[lang].theme_light_aria
            }
          >
            {theme === "light" ? <Moon size={18} weight="bold" /> : <Sun size={18} weight="bold" />}
            <span>
              {theme === "light" ? translations[lang].theme_dark : translations[lang].theme_light}
            </span>
          </button>
          <button
            type="button"
            className="lang-toggle"
            onClick={onToggleLang}
            aria-label={
              lang === "fr" ? translations[lang].lang_en_aria : translations[lang].lang_fr_aria
            }
          >
            <span>{lang === "fr" ? "FR" : "EN"}</span>
          </button>
        </div>
        <img src={heroPhoto} alt="WANKID en profil" className="wankid-hero-image" />
        <h1 className="wankid-title">WANKID</h1>
        <p className="wankid-subtitle">{translations[lang].subtitle}</p>
      </div>
    </motion.header>
  );
}

function AudioSection({ lang }: { lang: "fr" | "en" }) {
  return (
    <div className="audio-grid">
      {latestReleases.map((release) => (
        <article key={release.titleKey} className="audio-card">
          <div className="audio-meta">
            <h3>{translations[lang][release.titleKey]}</h3>
            <span>{translations[lang][release.formatKey]}</span>
          </div>
          <iframe
            className="audio-player"
            title={translations[lang][release.titleKey]}
            src={release.soundcloudEmbedUrl}
            allow="autoplay"
            loading="lazy"
          />
        </article>
      ))}
    </div>
  );
}

function VideoSection({ lang }: { lang: "fr" | "en" }) {
  return (
    <div className="video-grid">
      {latestVideos.map((video) => (
        <article key={video.titleKey} className="video-card">
          <div className="video-cta-frame">
            {video.url ? (
              <a href={video.url} target="_blank" rel="noreferrer" className="video-cta-link">
                {translations[lang][video.ctaKey]}
              </a>
            ) : (
              <span className="video-cta-placeholder">{translations[lang][video.ctaKey]}</span>
            )}
          </div>
          <div className="video-meta">
            <h3>{translations[lang][video.titleKey]}</h3>
            <span>{video.source}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function DatesSection({ lang }: { lang: "fr" | "en" }) {
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
              {translations[lang].tickets}
            </a>
          ) : (
            <span className="date-ticket is-disabled">{translations[lang].ticket_placeholder}</span>
          )}
        </article>
      ))}
    </div>
  );
}
