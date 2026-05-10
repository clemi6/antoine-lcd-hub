import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { DownloadSimple } from "@phosphor-icons/react";
import "./antoine.css";

const ACCENT = "#00ffcc";

export function VipPass() {
  const accent = ACCENT;
  const ref = useRef<HTMLAnchorElement>(null);

  const rotX = useSpring(useMotionValue(0), { stiffness: 80, damping: 15, mass: 1 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 80, damping: 15, mass: 1 });
  const swing = useSpring(useMotionValue(0), { stiffness: 45, damping: 6, mass: 1.5 });

  const [hover, setHover] = useState(false);
  const [isReceivingData, setIsReceivingData] = useState(false);

  const initialOrientation = useRef<{ x: null | number; y: null | number }>({
    x: null,
    y: null,
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

      const getScreenAngle = () => {
        const so = (window.screen && (window.screen as any).orientation && (window.screen as any).orientation.angle) ?? (window as any).orientation ?? 0;
        return Number(so) || 0;
      };

      const angle = getScreenAngle();

      let normX = e.gamma; // left/right
      let normY = e.beta; // front/back

      switch (angle) {
        case 0:
          normX = e.gamma;
          normY = e.beta;
          break;
        case 180:
          normX = -e.gamma;
          normY = -e.beta;
          break;
        case 90:
          normX = e.beta;
          normY = -e.gamma;
          break;
        case 270:
          normX = -e.beta;
          normY = e.gamma;
          break;
        default:
          normX = e.gamma;
          normY = e.beta;
      }

      if (initialOrientation.current.x === null) {
        initialOrientation.current = { x: normX, y: normY };
        return;
      }

      let deltaX = normX - (initialOrientation.current.x ?? 0);
      let deltaY = normY - (initialOrientation.current.y ?? 0);

      const maxTilt = 30;
      deltaY = Math.max(-maxTilt, Math.min(maxTilt, deltaY));
      deltaX = Math.max(-maxTilt, Math.min(maxTilt, deltaX));

      const simulatedMouseY = deltaY / maxTilt;
      const simulatedMouseX = deltaX / maxTilt;

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
      className="vip-pass-shell"
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{ rotate: swing, originY: 0 }}
        className="vip-pass-stage"
      >
        {/* LE TOUR DE COU EN V (FONDU ULTRA DOUX) */}
        <div
          className="vip-pass-lanyard"
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
            className="vip-pass-lanyard-left"
            style={{
              transform: "rotate(-12deg)",
              backgroundColor: accent,
              boxShadow: `0 0 15px ${accent}60`,
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.3) 50%, rgba(0,0,0,0.5) 100%)`,
            }}
          />
          {/* Ruban Droit */}
          <div
            className="vip-pass-lanyard-right"
            style={{
              transform: "rotate(12deg)",
              backgroundColor: accent,
              boxShadow: `0 0 15px ${accent}60`,
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.3) 50%, rgba(0,0,0,0.5) 100%)`,
            }}
          />
        </div>

        {/* LA PINCE MÉTALLIQUE */}
        <div className="vip-pass-clip">
          <div className="vip-pass-clip-top" />
          <div className="vip-pass-clip-bottom" />
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
          className="vip-pass-card"
        >
          {isReceivingData && (
            <div className="vip-pass-card-led" />
          )}

          <div className="vip-pass-card-slot" />

          <div className="vip-pass-card-content">
            <div className="vip-pass-tagline" style={{ color: accent }}>
              ★ ALL ACCESS ★
            </div>
            <div className="vip-pass-title">
              VIP
            </div>
            <div className="vip-pass-subtitle">
              PRESS KIT
            </div>

            <div className="vip-pass-meta">
              <span>NAME</span>
              <span>MEDIA / PROMO</span>
            </div>
            <div className="vip-pass-meta-2">
              <span>ID</span>
              <span>LCD-2026-0033</span>
            </div>

            <div className="vip-pass-barcode">
              {Array.from({ length: 32 }).map((_, i) => {
                const barWidth = ((i * 13) % 3) + 1;
                const spaceWidth = ((i * 7) % 2) + 1;
                return (
                  <div
                    key={i}
                    className="vip-pass-barcode-bar"
                    style={{
                      width: `${barWidth}px`,
                      marginRight: i === 31 ? "0px" : `${spaceWidth}px`,
                      height: "100%",
                    }}
                  />
                );
              })}
            </div>
            <div className="vip-pass-footnote">
              MEDIA ONLY · NON TRANSFERABLE
            </div>

            <div
              className={`vip-pass-download ${hover ? "is-hovered" : ""}`}
              style={{ color: hover ? accent : "rgba(255,255,255,0.6)" }}
            >
              <DownloadSimple size={14} weight="bold" /> DOWNLOAD .ZIP
            </div>
          </div>

          <motion.div
            className="vip-pass-card-light"
            style={{
              x: sheenX,
              y: sheenY,
              scale: 2,
              background: "linear-gradient(135deg, transparent 40%, rgba(0,255,204,0.25) 50%, transparent 60%)",
            }}
          />
        </motion.a>
      </motion.div>
    </div>
  );
}
