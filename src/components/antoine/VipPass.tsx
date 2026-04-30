import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { DownloadSimple } from "@phosphor-icons/react";
import { useTheme } from "./ThemeContext";

export function VipPass() {
  const { accent, isAfterparty } = useTheme();
  const ref = useRef<HTMLAnchorElement>(null);
  const rotX = useSpring(useMotionValue(0), { stiffness: 120, damping: 12 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 120, damping: 12 });
  const swing = useSpring(useMotionValue(0), { stiffness: 80, damping: 8 });
  const [hover, setHover] = useState(false);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    rotY.set(x * 25);
    rotX.set(-y * 18);
    swing.set(x * 8);
  };

  const onLeave = () => {
    rotX.set(0);
    rotY.set(0);
    swing.set(0);
    setHover(false);
  };

  const shadow = useTransform(
    rotY,
    (v) => `${-v / 2}px ${20 + Math.abs(v)}px 40px rgba(0,0,0,0.6)`,
  );

  // NOUVEAU : On relie l'inclinaison à la position du reflet
  // On multiplie par 6 pour que le reflet balaye bien toute la carte
  const sheenX = useTransform(rotY, (v) => v * 6);
  const sheenY = useTransform(rotX, (v) => -v * 6); // Inversé pour la physique de la lumière

  return (
    <div className="flex flex-col items-center pt-2 pb-6" style={{ perspective: 1000 }}>
      {/* lanyard cord */}
      <div className="relative h-16 w-2 overflow-hidden">
        <motion.div
          style={{ rotate: swing, originY: 0 }}
          className="absolute inset-x-0 top-0 h-full"
        >
          <div
            className="h-full w-full"
            style={{
              background: "repeating-linear-gradient(180deg, #2a2a30 0 6px, #15151c 6px 8px)",
            }}
          />
        </motion.div>
      </div>

      {/* clip */}
      <motion.div style={{ rotate: swing, originY: 0 }} className="-mt-1">
        <div className="h-3 w-10 rounded-sm bg-gradient-to-b from-[#888] via-[#444] to-[#222] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" />
      </motion.div>

      <motion.a
        ref={ref}
        href="#press-kit"
        download
        onPointerMove={onMove}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={onLeave}
        whileTap={{ scale: 0.97 }}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          rotate: swing,
          originY: 0,
          transformStyle: "preserve-3d",
          boxShadow: shadow,
        }}
        className="relative mt-1 block w-[230px] rounded-xl bg-[#0e0e14] border border-white/10 overflow-hidden"
      >
        {/* hole */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3 w-10 rounded-full bg-black border border-white/10" />

        <div className="pt-7 pb-4 px-4">
          <div
            className="font-mono-tech text-[8px] tracking-[0.4em] text-center"
            style={{ color: accent }}
          >
            ★ ALL ACCESS ★
          </div>
          <div className="font-display text-white text-3xl leading-none text-center mt-2">VIP</div>
          <div className="font-display text-white/80 text-xl leading-none text-center mt-0.5">
            PRESS KIT
          </div>

          <div className="mt-3 flex items-center justify-between font-mono-tech text-[8px] text-white/50">
            <span>NAME</span>
            <span>MEDIA / PROMO</span>
          </div>
          <div className="mt-1 flex items-center justify-between font-mono-tech text-[8px] text-white/40">
            <span>ID</span>
            <span>LCD-2026-0033</span>
          </div>

          {/* barcode corrigé */}
          <div className="mt-3 flex items-start h-10 bg-white px-3 py-1.5 rounded-sm mx-auto w-fit">
            {Array.from({ length: 32 }).map((_, i) => {
              const barWidth = ((i * 13) % 3) + 1;
              const spaceWidth = ((i * 7) % 2) + 1;

              return (
                <div
                  key={i}
                  className="bg-black shrink-0"
                  style={{
                    width: `${barWidth}px`,
                    marginRight: i === 31 ? "0px" : `${spaceWidth}px`,
                    height: "100%",
                  }}
                />
              );
            })}
          </div>
          <div className="font-mono-tech text-[8px] text-white/40 text-center mt-2 tracking-widest">
            MEDIA ONLY · NON TRANSFERABLE
          </div>

          <div
            className="mt-3 flex items-center justify-center gap-2 font-mono-tech text-[10px] tracking-[0.2em]"
            style={{ color: hover ? accent : "rgba(255,255,255,0.6)" }}
          >
            <DownloadSimple size={14} weight="bold" /> DOWNLOAD .ZIP
          </div>
        </div>

        {/* NOUVEAU : subtle reflective sheen (Transformé en motion.div avec x, y et scale) */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
          style={{
            x: sheenX,
            y: sheenY,
            scale: 2 /* On l'agrandit pour ne pas voir les bords quand le reflet bouge */,
            background: `linear-gradient(135deg, transparent 40%, ${
              isAfterparty ? "rgba(255,0,51,0.25)" : "rgba(0,255,204,0.25)"
            } 50%, transparent 60%)`,
          }}
        />
      </motion.a>
    </div>
  );
}
