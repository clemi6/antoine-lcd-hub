import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { DownloadSimple } from "@phosphor-icons/react";
import { useTheme } from "./ThemeContext";

export function VipPass() {
  const { accent, isAfterparty } = useTheme();
  const ref = useRef<HTMLAnchorElement>(null);

  // PHYSIQUE AMÉLIORÉE : Damping réduit et masse augmentée pour un effet "secousse/pendule" réaliste
  const rotX = useSpring(useMotionValue(0), { stiffness: 60, damping: 10, mass: 1.2 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 60, damping: 10, mass: 1.2 });
  const swing = useSpring(useMotionValue(0), { stiffness: 35, damping: 5, mass: 1.8 }); // Plus d'inertie ici !

  const [hover, setHover] = useState(false);
  const [isReceivingData, setIsReceivingData] = useState(false);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    // INVERSION SOURIS : On inverse le X pour que la rotation soit logique
    rotY.set(-x * 25);
    rotX.set(-y * 18);
    swing.set(-x * 15);
  };

  const onLeave = () => {
    rotX.set(0);
    rotY.set(0);
    swing.set(0);
    setHover(false);
  };

  const shadow = useTransform(rotY, (v) => `${v / 2}px ${20 + Math.abs(v)}px 40px rgba(0,0,0,0.6)`);
  const sheenX = useTransform(rotY, (v) => -v * 6);
  const sheenY = useTransform(rotX, (v) => -v * 6);

  const handleOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;

      setIsReceivingData((prev) => (prev ? prev : true));

      const beta = e.beta;
      const gamma = e.gamma;

      const adjustedBeta = beta - 60;
      const clampedBeta = Math.max(-45, Math.min(45, adjustedBeta));
      const clampedGamma = Math.max(-45, Math.min(45, gamma));

      const rx = (clampedBeta / 45) * 25;
      // INVERSION CAPTEURS : On ajoute un signe moins devant clampedGamma
      const ry = (-clampedGamma / 45) * 20;

      rotX.set(rx);
      rotY.set(ry);
      // On inverse aussi le balancier pour suivre la gravité naturelle
      swing.set(-clampedGamma * 1.2);
    },
    [rotX, rotY, swing],
  );

  useEffect(() => {
    let mounted = true;

    import("../../lib/orientation")
      .then((mod) => {
        if (!mounted) return;
        mod.addOrientationListener(handleOrientation);
      })
      .catch(() => null);

    return () => {
      mounted = false;
      import("../../lib/orientation").then((mod) => {
        mod.removeOrientationListener(handleOrientation);
      });
    };
  }, [handleOrientation]);

  return (
    <div className="flex flex-col items-center pt-0 pb-6" style={{ perspective: 1000 }}>
      {/* NOUVEAU DESIGN : Lanyard = Ruban texturé + Pince en métal */}
      <motion.div
        style={{ rotate: swing, originY: 0 }}
        className="relative flex flex-col items-center z-10 h-[88px] origin-top"
      >
        {/* Le ruban en tissu à la couleur de l'accent */}
        <div
          className="h-[70px] w-7 shadow-md"
          style={{
            backgroundColor: accent,
            // Effet d'ombrage cylindrique pour donner un aspect tissu/satin
            backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, rgba(0,0,0,0.4) 100%)`,
          }}
        />
        {/* La grosse pince métallique */}
        <div className="h-4 w-10 -mt-1 rounded-sm bg-gradient-to-b from-[#e0e0e0] via-[#888] to-[#222] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_3px_5px_rgba(0,0,0,0.6)] z-20" />
        {/* L'anneau de connexion qui passe dans le trou de la carte */}
        <div className="h-3 w-5 border-2 border-[#555] rounded-b-full -mt-1 z-0 shadow-inner" />
      </motion.div>

      {/* LA CARTE VIP (inchangée, mais alignée parfaitement avec la pince) */}
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
        // On remonte légèrement la carte pour que l'anneau morde dans le trou (-mt-3)
        className="relative -mt-3 block w-[230px] rounded-xl bg-[#0e0e14] border border-white/10 overflow-hidden"
      >
        {isReceivingData && (
          <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        )}

        {/* Le trou pour la pince */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3 w-10 rounded-full bg-black border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />

        <div className="pt-8 pb-4 px-4">
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

        <motion.div
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen"
          style={{
            x: sheenX,
            y: sheenY,
            scale: 2,
            background: `linear-gradient(135deg, transparent 40%, ${
              isAfterparty ? "rgba(255,0,51,0.25)" : "rgba(0,255,204,0.25)"
            } 50%, transparent 60%)`,
          }}
        />
      </motion.a>
    </div>
  );
}
