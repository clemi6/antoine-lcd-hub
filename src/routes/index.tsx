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
import { PlayerProvider, usePlayer } from "@/lib/player";
import { StickyPlayerProvider } from "@/lib/sticky-player";
import "./routes.css";
import CatalogCarousel from "@/components/CatalogCarousel";
import HorizontalCarousel from "@/components/HorizontalCarousel";
import MediaGallery, { MediaThumbnail } from "@/components/MediaGallery";
import VideoSection from "@/components/VideoSection";
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
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/antoinelcd/tracks&color=%23c7a575&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false",
  },
  {
    titleKey: "main_catalog_title",
    formatKey: "main_catalog_subtitle",
    soundcloudEmbedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/antoinelcd&color=%23c7a575&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false",
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
    media_gallery: "MÉDIAS",
    catalog_cta_title: "Découvre tous les autres sons",
    catalog_cta_subtitle: "Écoute la discographie complète sur SoundCloud ou Spotify.",
    listen_button: "Écouter",
    add_to_calendar: "Ajouter au calendrier",
    tickets_tba: "Billetterie à renseigner",
    mailing_title: "Rejoins le WANKID Club",
    mailing_subtitle: "Reçois des unreleased et des places gratuites",
    mailing_button: "Rejoindre",
    mailing_placeholder: "ton@email.com",
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
    media_gallery: "MEDIA",
    catalog_cta_title: "Discover the rest of the tracks",
    catalog_cta_subtitle: "Listen to the full discography on SoundCloud or Spotify.",
    listen_button: "Listen",
    add_to_calendar: "Add to calendar",
    tickets_tba: "Tickets TBA",
    mailing_title: "Join the WANKID Club",
    mailing_subtitle: "Get exclusive unreleased tracks and free tickets",
    mailing_button: "Join",
    mailing_placeholder: "your@email.com",
    track_year: "Year",
  },
};

// --- MOCK DATA ---
const mockCatalog = Array.from({ length: 8 }).map((_, i) => ({
  id: `mock-cat-${i + 1}`,
  title: `Mock Track ${i + 1}`,
  artist: `Artist ${i + 1}`,
  year: `202${(i % 10) + 1}`,
  url: "https://soundcloud.com/antoinelcd",
}));

const mockVideos = Array.from({ length: 6 }).map((_, i) => ({
  id: `mock-vid-${i + 1}`,
  title: `Mock Video ${i + 1}`,
  source: "YouTube",
  url: i === 0 ? "https://www.youtube.com/@antoinelcd" : "",
}));

const mockDates = Array.from({ length: 8 }).map((_, i) => ({
  day: String(((i + 3) % 28) + 1).padStart(2, "0"),
  month: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"][i % 8],
  year: `202${6 + (i % 2)}`,
  city: `City ${i + 1}`,
  venue: `Club ${i + 1}`,
  organizer: `Organizer ${i + 1}`,
  ticketUrl: i % 3 === 0 ? "" : "https://tickets.example.com",
}));

const mockMedia = Array.from({ length: 8 }).map((_, i) => ({
  id: `mock-media-${i + 1}`,
  type: i % 3 === 0 ? "video" : "image",
  src: "",
  poster: "",
  alt: `Mock media ${i + 1}`,
}));

function VideoCard({ v }: { v: any }) {
  return (
    <div className="video-card" role="article">
      <div className="video-thumb">
        <div className="video-play">▶</div>
      </div>
      <div className="video-info">
        <div className="video-title">{v.title}</div>
      </div>
    </div>
  );
}

function DateCard({ d, lang }: { d: any; lang: "fr" | "en" }) {
  const monthMap: Record<string, string> = {
    JAN: "01",
    FEB: "02",
    MAR: "03",
    APR: "04",
    MAY: "05",
    JUN: "06",
    JUL: "07",
    AUG: "08",
    SEP: "09",
    OCT: "10",
    NOV: "11",
    DEC: "12",
  };
  const mm = monthMap[d.month.toUpperCase()] ?? "01";
  const dd = d.day.padStart(2, "0");
  const yyyy = d.year;
  const start = `${yyyy}${mm}${dd}T200000`;
  const end = `${yyyy}${mm}${dd}T235900`;
  const title = `${d.venue} — ${d.city}`;
  const description = d.organizer ?? "";
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//WANKID//EN\nBEGIN:VEVENT\nUID:${yyyy}${mm}${dd}-${title}\nDTSTAMP:${yyyy}${mm}${dd}T000000Z\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:${title}\nDESCRIPTION:${description}\nLOCATION:${d.city}\nEND:VEVENT\nEND:VCALENDAR`;
  const icsDataUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;

  return (
    <div className="date-card">
      <div className="date-top">
        <div className="date-box">
          <div className="date-day">{d.day}</div>
          <div className="date-month">{d.month}</div>
        </div>
        <div className="date-info">
          <div className="date-venue">{d.venue}</div>
          <div className="date-city">{d.city}</div>
          <div className="date-time">20:00</div>
        </div>
      </div>
      <a
        href={icsDataUrl}
        download={`${d.venue.replace(/\s+/g, "-") || "event"}.ics`}
        className="button-base button-outline"
        style={{ width: "100%", marginTop: "8px", fontSize: "0.85rem" }}
      >
        {translations[lang].add_to_calendar}
      </a>
    </div>
  );
}


const THEME_KEY = "wankid-theme";

function makeICS(event: { day: string; month: string; year: string; venue: string; city: string; organizer?: string }) {
  const monthMap: Record<string, string> = {
    JAN: "01",
    FEB: "02",
    MAR: "03",
    APR: "04",
    MAY: "05",
    JUN: "06",
    JUL: "07",
    AUG: "08",
    SEP: "09",
    OCT: "10",
    NOV: "11",
    DEC: "12",
  };
  const mm = monthMap[event.month.toUpperCase()] ?? "01";
  const dd = event.day.padStart(2, "0");
  const yyyy = event.year;
  const start = `${yyyy}${mm}${dd}T200000`;
  const end = `${yyyy}${mm}${dd}T235900`;
  const title = `${event.venue} — ${event.city}`;
  const description = event.organizer ?? "";
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//WANKID//EN\nBEGIN:VEVENT\nUID:${yyyy}${mm}${dd}-${title}\nDTSTAMP:${yyyy}${mm}${dd}T000000Z\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:${title}\nDESCRIPTION:${description}\nLOCATION:${event.city}\nEND:VEVENT\nEND:VCALENDAR`;
  return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
}

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
  
  const isMobile = useIsMobile(768);
  const [lang, setLang] = useState<"fr" | "en">(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.localStorage.getItem("wankid-lang");
    if (saved === "fr" || saved === "en") return saved;
    return navigator.language && navigator.language.startsWith("fr") ? "fr" : "en";
  });

  const t = (key: string) => translations[lang]?.[key] ?? key;

  // Limit catalogue to top releases for performance and clarity
  const CATALOG_MAX = isMobile ? 4 : 6;
  const visibleCatalogTracks = catalogTracks.slice(0, CATALOG_MAX);

  // catalogue pagination removed in favor of a limited selection

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(bookingEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // Player moved to PlayerProvider (see src/lib/player.tsx)
  const [mailingEmail, setMailingEmail] = useState("");
  const [mailingStatus, setMailingStatus] = useState<"idle" | "sent" | "error">("idle");

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <div className="app-shell" style={contentBackgroundStyle}>
      <main className="app-main is-visible">
        <StickyPlayerProvider>
          <PlayerProvider>
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
            onToggleLang={() => {
              const next = lang === "fr" ? "en" : "fr";
              setLang(next);
              try {
                window.localStorage.setItem("wankid-lang", next);
                window.dispatchEvent(new CustomEvent("wankid-lang-changed", { detail: next }));
              } catch (e) {}
            }}
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
            <CatalogCarousel
              tracks={visibleCatalogTracks}
              title={t('catalog')}
              playLabel={t('catalog_play')}
              ctaTitle={t('catalog_cta_title')}
              ctaSubtitle={t('catalog_cta_subtitle')}
            />
          </section>
          <section className="wankid-video-section">
            <div className="wankid-section-head">{translations[lang].videos}</div>
            <VideoSection />
          </section>
          
          <section className="wankid-dates-section">
            <div className="wankid-section-head">{translations[lang].upcoming_dates}</div>
            <DatesSection lang={lang} />
          </section>
          <section className="wankid-pass-section">
            <div className="wankid-section-head">{translations[lang].press_access}</div>
            <VipPass theme={theme} />
          </section>
          <section className="wankid-mailing-section">
            <div className="wankid-section-head">{t('mailing_title')}</div>
            <div className="mailing-card">
              <p className="mailing-copy">{t('mailing_subtitle')}</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // fallback: open mail client to capture subscription if no backend
                  if (!mailingEmail) return setMailingStatus("error");
                  const mailto = `mailto:${bookingEmail}?subject=${encodeURIComponent(
                    "WANKID Club subscription",
                  )}&body=${encodeURIComponent("Email: " + mailingEmail)}&`;
                  window.open(mailto, "_blank");
                  setMailingStatus("sent");
                }}
              >
                <div className="mailing-row">
                  <input
                    type="email"
                    placeholder={t('mailing_placeholder')}
                    value={mailingEmail}
                    onChange={(ev) => setMailingEmail(ev.target.value)}
                    className="mailing-input"
                    required
                  />
                  <button type="submit" className="button-base button-accent">
                    {t('mailing_button')}
                  </button>
                </div>
                {mailingStatus === "sent" && <div className="mailing-toast">Merci ! Check ta boîte.</div>}
              </form>
            </div>
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
          {/* Player UI is provided by PlayerProvider (see src/lib/player.tsx) */}
          </motion.div>
          </PlayerProvider>
        </StickyPlayerProvider>
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
            <span className="lang-flag">{lang === "fr" ? "🇬🇧" : "🇫🇷"}</span>
            <span>{lang === "fr" ? "EN" : "FR"}</span>
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

function DatesSection({ lang }: { lang: "fr" | "en" }) {
  return (
    <HorizontalCarousel rows={2} className="dates-horizontal">
      {mockDates.map((d) => (
        <DateCard key={`${d.day}-${d.month}-${d.venue}`} d={d} lang={lang} />
      ))}
    </HorizontalCarousel>
  );
}
