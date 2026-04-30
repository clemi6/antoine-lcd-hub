import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { DownloadSimple } from "@phosphor-icons/react";
import { useTheme } from "./ThemeContext";

export function VipPass() {
  const { accent, isAfterparty } = useTheme();
  const ref = useRef<HTMLAnchorElement>(null);

  const rotX = useSpring(useMotionValue(0), { stiffness: 80, damping: 15, mass: 1 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 80, damping: 15, mass: 1 });
  const swing = useSpring(useMotionValue(0), { stiffness: 45, damping: 6, mass: 1.5 });

  const [hover, setHover] = useState(false);
  const [isReceivingData, setIsReceivingData] = useState(false);

  const initialOrientation = useRef<{ beta: null | number; gamma: null | number }>({
    beta: null,
    gamma: null,
  });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;

    rotY.set(-x * 35);
    rotX.set(-y * 35);
    swing.set(-x * 12);
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

      if (initialOrientation.current.beta === null) {
        initialOrientation.current = { beta: e.beta, gamma: e.gamma };
        return;
      }

      let deltaBeta = e.beta - (initialOrientation.current.beta ?? 0);
      let deltaGamma = e.gamma - (initialOrientation.current.gamma ?? 0);

      const maxTilt = 30;
      deltaBeta = Math.max(-maxTilt, Math.min(maxTilt, deltaBeta));
      deltaGamma = Math.max(-maxTilt, Math.min(maxTilt, deltaGamma));

      const simulatedMouseY = deltaBeta / maxTilt;
      const simulatedMouseX = deltaGamma / maxTilt;

      rotY.set(-simulatedMouseX * 35);
      rotX.set(-simulatedMouseY * 35);
      swing.set(-simulatedMouseX * 12);
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
    <div
      className="flex flex-col items-center pt-0 pb-6 relative z-0"
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ rotate: swing, originY: 0 }}
        className="relative flex flex-col items-center origin-top w-full"
      >
        {/* LE TOUR DE COU EN V (FONDU ULTRA DOUX) */}
        <div
          className="relative flex justify-center pointer-events-none w-[200px] h-[150px] -mb-5 -z-10"
          style={{
            // MODIFICATION ICI : Il est solide de 0 à 10%, puis s'efface totalement à 80%.
            // Les 20% restants de la div sont invisibles, garantissant qu'aucune ligne droite ne s'affiche.
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 80%)",
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 80%)",
          }}
        >
          {/* Ruban Gauche */}
          <div
            className="absolute bottom-0 right-1/2 w-[16px] h-full origin-bottom-right"
            style={{
              transform: "rotate(-12deg)",
              backgroundColor: accent,
              boxShadow: `0 0 15px ${accent}60`,
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.3) 50%, rgba(0,0,0,0.5) 100%)`,
            }}
          />
          {/* Ruban Droit */}
          <div
            className="absolute bottom-0 left-1/2 w-[16px] h-full origin-bottom-left"
            style={{
              transform: "rotate(12deg)",
              backgroundColor: accent,
              boxShadow: `0 0 15px ${accent}60`,
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.3) 50%, rgba(0,0,0,0.5) 100%)`,
            }}
          />
        </div>

        {/* LA PINCE MÉTALLIQUE */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="h-4 w-[40px] rounded-sm bg-gradient-to-b from-[#e0e0e0] via-[#888] to-[#222] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_3px_5px_rgba(0,0,0,0.6)]" />
          <div className="h-3 w-5 border-2 border-[#555] rounded-b-full -mt-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]" />
        </div>

        {/* LA CARTE VIP */}
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
            originY: 0,
            transformStyle: "preserve-3d",
            boxShadow: shadow,
          }}
          className="relative -mt-3 block w-[230px] rounded-xl bg-[#0e0e14] border border-white/10 overflow-hidden"
        >
          {isReceivingData && (
            <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          )}

          <div className="absolute top-2 left-1/2 -translate-x-1/2 h-3 w-10 rounded-full bg-black border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" />

          <div className="pt-8 pb-4 px-4">
            <div
              className="font-mono-tech text-[8px] tracking-[0.4em] text-center"
              style={{ color: accent }}
            >
              ★ ALL ACCESS ★
            </div>
            <div className="font-display text-white text-3xl leading-none text-center mt-2">
              VIP
            </div>
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
      </motion.div>
    </div>
  );
}
