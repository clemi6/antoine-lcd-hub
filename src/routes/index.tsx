import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  ShoppingBag,
  ArrowRight,
} from "@phosphor-icons/react";
import { Hero } from "@/components/antoine/Hero";
import { SocialLinks } from "@/components/antoine/SocialLinks";
import { StrobeLayer, useStrobe, useGlitch } from "@/components/antoine/GlitchStrobe";
import { VipPass } from "@/components/antoine/VipPass";
import "./routes.css";
import profileImg from "@/assets/antoine-profile.jpg";
import hitImg from "@/assets/release-hit.jpg";
import rel1 from "@/assets/release-1.jpg";
import rel2 from "@/assets/release-2.jpg";
import rel3 from "@/assets/release-3.jpg";
import rel4 from "@/assets/release-4.jpg";
import live1 from "@/assets/live-1.jpg";
import live2 from "@/assets/live-2.jpg";
import live3 from "@/assets/live-3.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const ACCENT = "#00ffcc";
const ACCENT_RGB = "0,255,204";

function Index() {
  return <App />;
}

const releases = [
  { title: "VOID PROTOCOL", year: "2025", img: rel1 },
  { title: "NUIT BLANCHE", year: "2024", img: rel2 },
  { title: "UNDERGROUND", year: "2024", img: rel3 },
  { title: "STEEL FRAME", year: "2023", img: rel4 },
];
const lives = [live1, live2, live3];
const tour = [
  { date: "MAY 09", venue: "Berghain", city: "Berlin", soldOut: false },
  { date: "MAY 23", venue: "Concrete", city: "Paris", soldOut: true },
  { date: "JUN 14", venue: "Fabric", city: "London", soldOut: false },
];

function App() {
  const [entered, setEntered] = useState(false);
  const strobe = useStrobe();

  return (
    <div className="app-shell">
      <StrobeLayer active={strobe.active} />
      <Hero title="ANTOINE LCD" onEnter={() => setEntered(true)} />

      <main
        className={`app-main ${entered ? "is-visible" : "is-hidden"}`}
      >

        <AnimatePresence>
          {entered && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
              }}
            >
              <Header />
              <SocialLinks />
              <BiggestHit accent={ACCENT} accentRgb={ACCENT_RGB} strobe={strobe.trigger} />
              <Releases accent={ACCENT} />
              <AudioBlock accent={ACCENT} />
              <LiveGallery accent={ACCENT} />
              <TourDates accent={ACCENT} accentRgb={ACCENT_RGB} strobe={strobe.trigger} />
              <PressKit />
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

function Header() {
  return (
    <motion.header variants={item} className="page-header">
      <div
        className="page-avatar-shell"
        style={{
          background: `conic-gradient(from 180deg, ${ACCENT}, transparent 60%, ${ACCENT})`,
        }}
      >
        <img
          src={profileImg}
          alt="ANTOINE LCD portrait"
          width={110}
          height={110}
          className="page-avatar"
        />
      </div>
      <h1 className="page-title">ANTOINE LCD</h1>
      <div className="page-kicker" style={{ color: ACCENT }}>
        TECHNO · HARDWARE · LIVE
      </div>
      <p className="page-intro">
        Industrial techno from the underground. Modular hardware sets, blood-pressure BPM, no
        laptops on the booth.
      </p>
    </motion.header>
  );
}

function BiggestHit({
  accent,
  accentRgb,
  strobe,
}: {
  accent: string;
  accentRgb: string;
  strobe: () => void;
}) {
  const glitch = useGlitch();
  return (
    <motion.section variants={item} className="section-block">
      <div className="section-head">
        <div className="section-label-group">
          <span className="section-dot" style={{ background: accent }} />
          <span className="section-label">
          BIGGEST HIT // 01
          </span>
        </div>
      </div>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="card-shell card-shell--dark"
      >
        <div className="card-media card-media--square">
          <img
            src={hitImg}
            alt="Arrêt du Cœur x Memories cover"
            width={800}
            height={800}
            className="card-media-img"
          />
        </div>
        <div className="card-body">
          <div className="card-kicker card-kicker--accent" style={{ color: accent }}>
            NEW SINGLE · 138 BPM
          </div>
          <h2 className="card-title card-title--xl">
            ARRÊT DU CŒUR
            <span style={{ color: "rgba(255,255,255,0.4)" }}> × </span>
            MEMORIES
          </h2>
          <p className="card-text">
            Cardiac kickdrum meets fading polaroids. Out now on every platform.
          </p>
          <motion.a
            href="https://soundcloud.com"
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.96 }}
            onPointerDown={() => {
              strobe();
              glitch.fire();
            }}
            className={`button-base button-accent ${glitch.className}`}
            style={{
              background: accent,
              boxShadow: `0 0 30px rgba(${accentRgb},0.35)`,
            }}
          >
            <Play size={18} weight="fill" /> LISTEN ON SOUNDCLOUD
          </motion.a>
        </div>
      </motion.div>
    </motion.section>
  );
}

function Releases({ accent }: { accent: string }) {
  return (
    <motion.section variants={item} className="section-block section-block--edge">
      <div className="section-head">
        <div className="section-label-group">
          <span className="section-dot" style={{ background: accent }} />
          <span className="section-label">
            RELEASES // CATALOG
          </span>
        </div>
        <span className="section-hint">SWIPE →</span>
      </div>
      <div className="carousel-track scrollbar-hidden">
        {releases.map((r) => (
          <motion.a
            key={r.title}
            href="#"
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -4 }}
            draggable={false}
            className="carousel-card carousel-card--release"
          >
            <div className="card-shell card-shell--dark card-media--square" style={{ position: "relative" }}>
              <img
                src={r.img}
                alt={r.title}
                width={512}
                height={512}
                draggable={false}
                loading="lazy"
                className="card-media-img"
              />
              <div className="card-overlay">
                <div className="card-overlay-badge" style={{ background: accent }}>
                  <Play size={20} weight="fill" style={{ color: "black", marginLeft: 2 }} />
                </div>
              </div>
            </div>
            <div className="card-title card-title--lg">{r.title}</div>
            <div className="card-meta card-meta--small">{r.year}</div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}

function AudioBlock({ accent }: { accent: string }) {
  return (
    <motion.section variants={item} className="section-block">
      <div className="section-head" style={{ justifyContent: "flex-start" }}>
        <div className="section-label-group">
          <span className="section-dot" style={{ background: accent }} />
          <span className="section-label">
          AUDIO // STREAM
          </span>
        </div>
      </div>
      <div className="card-shell card-shell--dark">
        <iframe
          title="SoundCloud player"
          width="100%"
          height="160"
          allow="autoplay"
          className="card-media-img"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1234567890&color=%2300ffcc&inverse=true&auto_play=false&show_user=true&hide_related=true&visual=false"
        />
      </div>
      <div className="button-row">
        <motion.a
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -2 }}
          href="https://bandcamp.com"
          target="_blank"
          rel="noreferrer"
          className="button-base button-dark"
        >
          <ShoppingBag size={14} weight="bold" /> BANDCAMP
        </motion.a>
        <motion.a
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -2 }}
          href="#press-kit"
          className="button-base button-accent"
          style={{ background: accent }}
        >
          PRESS KIT <ArrowRight size={14} weight="bold" />
        </motion.a>
      </div>
    </motion.section>
  );
}

function LiveGallery({ accent }: { accent: string }) {
  return (
    <motion.section variants={item} className="section-block section-block--edge">
      <div className="section-head">
        <div className="section-label-group">
          <span className="section-dot" style={{ background: accent }} />
          <span className="section-label">
            LIVE & VISUALS
          </span>
        </div>
        <span className="section-hint">SWIPE →</span>
      </div>
      <div className="carousel-track scrollbar-hidden">
        {lives.map((src, i) => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.98 }}
            className="carousel-card carousel-card--live card-shell card-shell--dark"
          >
            <img
              src={src}
              alt={`Live show ${i + 1}`}
              width={1280}
              height={720}
              draggable={false}
              loading="lazy"
              className="card-media-img"
            />
            <div className="card-counter">
              0{i + 1} / 0{lives.length}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function TourDates({
  accent,
  accentRgb,
  strobe,
}: {
  accent: string;
  accentRgb: string;
  strobe: () => void;
}) {
  return (
    <motion.section variants={item} className="section-block">
      <div className="section-head" style={{ justifyContent: "flex-start" }}>
        <div className="section-label-group">
          <span className="section-dot" style={{ background: accent }} />
          <span className="section-label">
          TOUR // 2026
          </span>
        </div>
      </div>
      <div className="tour-shell">
        {tour.map((t) => (
          <TourRow key={t.venue} t={t} accent={accent} accentRgb={accentRgb} strobe={strobe} />
        ))}
      </div>
    </motion.section>
  );
}

function TourRow({
  t,
  accent,
  accentRgb,
  strobe,
}: {
  t: (typeof tour)[number];
  accent: string;
  accentRgb: string;
  strobe: () => void;
}) {
  const glitch = useGlitch();
  const [m, d] = t.date.split(" ");
  return (
    <div className="tour-row">
      <div className="tour-info">
        <div className="tour-date">
          <div className="tour-date-month">{m}</div>
          <div className="tour-date-day">{d}</div>
        </div>
        <div className="tour-venue">
          <div className="tour-venue-name">{t.venue}</div>
          <div className="tour-venue-city">
            {t.city}
          </div>
        </div>
      </div>
      {t.soldOut ? (
        <div className="tour-badge tour-badge--soldout">
          SOLD OUT
        </div>
      ) : (
        <motion.a
          href="#"
          whileTap={{ scale: 0.94 }}
          onPointerDown={() => {
            strobe();
            glitch.fire();
          }}
          className={`tour-badge tour-badge--tickets ${glitch.className}`}
          style={{
            background: accent,
            boxShadow: `0 0 18px rgba(${accentRgb},0.35)`,
          }}
        >
          TICKETS
        </motion.a>
      )}
    </div>
  );
}

function PressKit() {
  return (
    <motion.section id="press-kit" variants={item} className="section-block">
      <div className="section-head" style={{ justifyContent: "flex-start" }}>
        <div className="section-label-group">
          <span className="section-dot" style={{ background: "rgba(255,255,255,0.4)" }} />
          <span className="section-label">
          BACKSTAGE // PRESS
          </span>
        </div>
      </div>
      <VipPass />
    </motion.section>
  );
}

function Footer() {
  return (
    <motion.footer variants={item} className="section-footer">
      <div className="section-footer-text">
        © 2026 ANTOINE LCD · BOOKING@ANTOINELCD.COM
      </div>
    </motion.footer>
  );
}
