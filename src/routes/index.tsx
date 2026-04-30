import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  InstagramLogo,
  SoundcloudLogo,
  TiktokLogo,
  YoutubeLogo,
  Play,
  ShoppingBag,
  ArrowRight,
} from "@phosphor-icons/react";
import { ThemeProvider, useTheme } from "@/components/antoine/ThemeContext";
import { SpinToEnter } from "@/components/antoine/SpinToEnter";
import { MixerToggle } from "@/components/antoine/MixerToggle";
import { StrobeLayer, useStrobe, useGlitch } from "@/components/antoine/GlitchStrobe";
import { VipPass } from "@/components/antoine/VipPass";
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

function Index() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
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
  const { isAfterparty, accent, accentRgb } = useTheme();
  const strobe = useStrobe();

  return (
    <div
      className="relative min-h-screen w-full transition-colors duration-700"
      style={{
        background: isAfterparty
          ? "radial-gradient(ellipse at top, #2a0008 0%, #100004 50%, #050001 100%)"
          : "radial-gradient(ellipse at top, #1a1a24 0%, #0d0d12 60%, #050506 100%)",
      }}
    >
      {isAfterparty && <div className="noise-overlay" aria-hidden />}
      <StrobeLayer active={strobe.active} />
      <SpinToEnter onEnter={() => setEntered(true)} />

      <main className="mx-auto w-full max-w-[480px] px-5 pb-24 pt-3">
        <MixerToggle />

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
              <Socials />
              <BiggestHit accent={accent} accentRgb={accentRgb} strobe={strobe.trigger} />
              <Releases accent={accent} />
              <AudioBlock accent={accent} />
              <LiveGallery accent={accent} />
              <TourDates accent={accent} accentRgb={accentRgb} strobe={strobe.trigger} />
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
  const { accent } = useTheme();
  return (
    <motion.header variants={item} className="flex flex-col items-center text-center pt-4 pb-6">
      <div
        className="relative h-[110px] w-[110px] rounded-full p-[2px]"
        style={{
          background: `conic-gradient(from 180deg, ${accent}, transparent 60%, ${accent})`,
        }}
      >
        <img
          src={profileImg}
          alt="ANTOINE LCD portrait"
          width={110}
          height={110}
          className="h-full w-full rounded-full object-cover bg-black"
        />
      </div>
      <h1 className="font-display text-white text-[64px] leading-[0.9] mt-5">ANTOINE LCD</h1>
      <div className="font-mono-tech text-[10px] tracking-[0.4em] mt-2" style={{ color: accent }}>
        TECHNO · HARDWARE · LIVE
      </div>
      <p className="font-sans text-sm text-white/60 mt-3 max-w-[300px] leading-relaxed">
        Industrial techno from the underground. Modular hardware sets, blood-pressure BPM, no
        laptops on the booth.
      </p>
    </motion.header>
  );
}

function Socials() {
  const socials = [
    { Icon: InstagramLogo, href: "https://instagram.com", label: "Instagram" },
    { Icon: SoundcloudLogo, href: "https://soundcloud.com", label: "SoundCloud" },
    { Icon: TiktokLogo, href: "https://tiktok.com", label: "TikTok" },
    { Icon: YoutubeLogo, href: "https://youtube.com", label: "YouTube" },
  ];
  const { accent } = useTheme();
  return (
    <motion.div variants={item} className="flex justify-center gap-3 pb-6">
      {socials.map(({ Icon, href, label }) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          whileHover={{ y: -3, backgroundColor: accent, color: "#000" }}
          whileTap={{ scale: 0.92 }}
          className="h-11 w-11 rounded-full bg-[#15151c] border border-white/5 flex items-center justify-center text-white/80 transition-shadow"
          style={{ boxShadow: `0 0 0 0 ${accent}` }}
        >
          <Icon size={20} weight="fill" />
        </motion.a>
      ))}
    </motion.div>
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
    <motion.section variants={item} className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
        <span className="font-mono-tech text-[10px] tracking-[0.3em] text-white/50">
          BIGGEST HIT // 01
        </span>
      </div>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="overflow-hidden rounded-2xl bg-[#15151c] border border-white/5"
      >
        <div className="aspect-square w-full overflow-hidden bg-black">
          <img
            src={hitImg}
            alt="Arrêt du Cœur x Memories cover"
            width={800}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-5">
          <div className="font-mono-tech text-[10px] tracking-[0.3em]" style={{ color: accent }}>
            NEW SINGLE · 138 BPM
          </div>
          <h2 className="font-display text-white text-[34px] leading-none mt-2">
            ARRÊT DU CŒUR
            <span className="text-white/40"> × </span>
            MEMORIES
          </h2>
          <p className="text-white/60 text-sm mt-2">
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
            className={`mt-4 flex items-center justify-center gap-3 rounded-xl py-4 font-mono-tech text-[12px] tracking-[0.3em] text-black ${glitch.className}`}
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
    <motion.section variants={item} className="mb-8 -mx-5">
      <div className="px-5 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          <span className="font-mono-tech text-[10px] tracking-[0.3em] text-white/50">
            RELEASES // CATALOG
          </span>
        </div>
        <span className="font-mono-tech text-[10px] text-white/30">SWIPE →</span>
      </div>
      <div className="flex gap-3 px-5 pb-1 carousel-scroll scrollbar-hidden snap-x snap-mandatory">
        {releases.map((r) => (
          <motion.a
            key={r.title}
            href="#"
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -4 }}
            draggable={false}
            className="group relative shrink-0 w-[150px] sm:w-[170px] snap-start"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-[#15151c] border border-white/5">
              <img
                src={r.img}
                alt={r.title}
                width={512}
                height={512}
                draggable={false}
                loading="lazy"
                className="h-full w-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <div
                  className="h-12 w-12 rounded-full flex items-center justify-center"
                  style={{ background: accent }}
                >
                  <Play size={20} weight="fill" className="text-black ml-0.5" />
                </div>
              </div>
            </div>
            <div className="mt-2 font-display text-white text-lg leading-none">{r.title}</div>
            <div className="font-mono-tech text-[10px] text-white/40 mt-1">{r.year}</div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
}

function AudioBlock({ accent }: { accent: string }) {
  return (
    <motion.section variants={item} className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
        <span className="font-mono-tech text-[10px] tracking-[0.3em] text-white/50">
          AUDIO // STREAM
        </span>
      </div>
      <div className="rounded-xl bg-[#15151c] border border-white/5 overflow-hidden">
        <iframe
          title="SoundCloud player"
          width="100%"
          height="160"
          allow="autoplay"
          className="block"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1234567890&color=%2300ffcc&inverse=true&auto_play=false&show_user=true&hide_related=true&visual=false"
        />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <motion.a
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -2 }}
          href="https://bandcamp.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#15151c] border border-white/10 py-3.5 font-mono-tech text-[10px] tracking-[0.25em] text-white/80 hover:text-white"
        >
          <ShoppingBag size={14} weight="bold" /> BANDCAMP
        </motion.a>
        <motion.a
          whileTap={{ scale: 0.97 }}
          whileHover={{ y: -2 }}
          href="#press-kit"
          className="flex items-center justify-center gap-2 rounded-xl py-3.5 font-mono-tech text-[10px] tracking-[0.25em] text-black"
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
    <motion.section variants={item} className="mb-8 -mx-5">
      <div className="px-5 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          <span className="font-mono-tech text-[10px] tracking-[0.3em] text-white/50">
            LIVE & VISUALS
          </span>
        </div>
        <span className="font-mono-tech text-[10px] text-white/30">SWIPE →</span>
      </div>
      <div className="flex gap-3 px-5 pb-1 carousel-scroll scrollbar-hidden snap-x snap-mandatory">
        {lives.map((src, i) => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.98 }}
            className="relative shrink-0 w-[82vw] max-w-[300px] sm:w-[320px] aspect-video overflow-hidden rounded-xl border border-white/5 bg-[#15151c] snap-start"
          >
            <img
              src={src}
              alt={`Live show ${i + 1}`}
              width={1280}
              height={720}
              draggable={false}
              loading="lazy"
              className="h-full w-full object-cover pointer-events-none"
            />
            <div className="absolute bottom-2 left-3 font-mono-tech text-[10px] tracking-widest text-white/80">
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
    <motion.section variants={item} className="mb-10">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
        <span className="font-mono-tech text-[10px] tracking-[0.3em] text-white/50">
          TOUR // 2026
        </span>
      </div>
      <div className="rounded-xl bg-[#15151c] border border-white/5 overflow-hidden divide-y divide-white/5">
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
    <div className="flex items-center justify-between px-4 py-4 gap-3">
      <div className="flex items-center gap-4 min-w-0">
        <div className="text-center w-12 shrink-0">
          <div className="font-mono-tech text-[10px] tracking-widest text-white/40">{m}</div>
          <div className="font-display text-white text-3xl leading-none">{d}</div>
        </div>
        <div className="min-w-0">
          <div className="font-display text-white text-xl leading-none truncate">{t.venue}</div>
          <div className="font-mono-tech text-[10px] tracking-widest text-white/50 mt-1">
            {t.city}
          </div>
        </div>
      </div>
      {t.soldOut ? (
        <div className="font-mono-tech text-[10px] tracking-[0.25em] px-3 py-2 rounded-md bg-white/5 text-white/30 border border-white/5">
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
          className={`font-mono-tech text-[10px] tracking-[0.25em] px-3 py-2 rounded-md text-black ${glitch.className}`}
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
    <motion.section id="press-kit" variants={item} className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        <span className="font-mono-tech text-[10px] tracking-[0.3em] text-white/50">
          BACKSTAGE // PRESS
        </span>
      </div>
      <VipPass />
    </motion.section>
  );
}

function Footer() {
  return (
    <motion.footer variants={item} className="text-center pt-6">
      <div className="font-mono-tech text-[9px] tracking-[0.4em] text-white/25">
        © 2026 ANTOINE LCD · BOOKING@ANTOINELCD.COM
      </div>
    </motion.footer>
  );
}
