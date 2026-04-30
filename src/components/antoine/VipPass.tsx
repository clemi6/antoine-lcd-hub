import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { DownloadSimple } from "@phosphor-icons/react";
import { useTheme } from "./ThemeContext";

export function VipPass() {
  const { accent, isAfterparty } = useTheme();
  const ref = useRef<HTMLAnchorElement>(null);
  const rotX = useSpring(useMotionValue(0), { stiffness: 80, damping: 15, mass: 1 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 80, damping: 15, mass: 1 });
  const swing = useSpring(useMotionValue(0), { stiffness: 40, damping: 8, mass: 1.5 });
  const [hover, setHover] = useState(false);
  const [orientationEnabled, setOrientationEnabled] = useState(false);

  // État pour savoir si on doit afficher le bouton d'autorisation (uniquement pour iOS)
  const [showPermissionButton, setShowPermissionButton] = useState(false);

  const orientationManager = useRef(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    rotY.set(x * 25);
    rotX.set(-y * 18);
    swing.set(x * 12);
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
  const sheenX = useTransform(rotY, (v) => v * 6);
  const sheenY = useTransform(rotX, (v) => -v * 6);

  // Utilisation de useCallback pour éviter les avertissements ESLint dans le useEffect
  const handleOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;

      const beta = e.beta;
      const gamma = e.gamma;

      const adjustedBeta = beta - 60;
      const clampedBeta = Math.max(-45, Math.min(45, adjustedBeta));
      const clampedGamma = Math.max(-45, Math.min(45, gamma));

      const rx = (clampedBeta / 45) * 25;
      const ry = (clampedGamma / 45) * 20;

      rotX.set(rx);
      rotY.set(ry);
      swing.set(clampedGamma * 0.8);
    },
    [rotX, rotY, swing],
  );

  useEffect(() => {
    let mounted = true;
    let removed = false;

    import("../../lib/orientation")
      .then((mod) => {
        if (!mounted) return;
        orientationManager.current = mod;

        // Si l'appareil N'A PAS besoin de permission (Android, PC)
        if (!mod.hasPermissionAPI()) {
          mod.addOrientationListener(handleOrientation);
          setOrientationEnabled(true);
        } else {
          // C'est un appareil iOS : on affiche le bouton pour demander l'accès
          setShowPermissionButton(true);
        }
      })
      .catch(() => null);

    return () => {
      mounted = false;
      if (orientationManager.current && !removed) {
        orientationManager.current.removeOrientationListener(handleOrientation);
        removed = true;
      }
    };
  }, [handleOrientation]);

  async function enableOrientation() {
    const mod = orientationManager.current;
    if (!mod) return false;

    const ok = await mod.requestPermission();

    if (ok) {
      mod.addOrientationListener(handleOrientation);
      setOrientationEnabled(true);
      setShowPermissionButton(false); // On cache le bouton une fois autorisé !
      return true;
    }
    return false;
  }

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
        {orientationEnabled && (
          <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        )}
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

      {/* Le bouton pop-up dédié pour iOS */}
      {showPermissionButton && (
        <button
          onClick={enableOrientation}
          className="mt-6 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono-tech text-xs tracking-widest transition-all backdrop-blur-sm"
          style={{ color: accent }}
        >
          ACTIVER LA 3D
        </button>
      )}
    </div>
  );
}
