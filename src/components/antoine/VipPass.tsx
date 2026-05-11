import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { DownloadSimple } from "@phosphor-icons/react";
import "./antoine.css";

type VipPassProps = {
  theme?: "light" | "dark";
};

type LegacyOrientationWindow = Window & {
  orientation?: number;
};

type ScreenWithOrientation = Screen & {
  orientation?: {
    angle?: number;
  };
};

export function VipPass({ theme = "light" }: VipPassProps) {
  const accent = theme === "dark" ? "#63dbc4" : "#c7a575";
  const ribbonShadow = theme === "dark" ? `${accent}52` : `${accent}40`;
  const lightGradient =
    theme === "dark"
      ? "linear-gradient(135deg, transparent 40%, rgba(99,219,196,0.22) 50%, transparent 60%)"
      : "linear-gradient(135deg, transparent 40%, rgba(199,165,117,0.22) 50%, transparent 60%)";

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const animationApi = useRef<{
    setStageRotate: ((value: number) => void) | null;
    setCardRotateX: ((value: number) => void) | null;
    setCardRotateY: ((value: number) => void) | null;
    setLightX: ((value: number) => void) | null;
    setLightY: ((value: number) => void) | null;
    setShadow: ((value: string) => void) | null;
  }>({
    setStageRotate: null,
    setCardRotateX: null,
    setCardRotateY: null,
    setLightX: null,
    setLightY: null,
    setShadow: null,
  });

  const [hover, setHover] = useState(false);
  const [isReceivingData, setIsReceivingData] = useState(false);

  const downloadColor = hover
    ? accent
    : theme === "dark"
      ? "rgba(244,243,239,0.7)"
      : "rgba(43,34,23,0.62)";

  const initialOrientation = useRef<{ x: null | number; y: null | number }>({
    x: null,
    y: null,
  });

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const light = lightRef.current;

    if (!stage || !card || !light) return;

    animationApi.current = {
      setStageRotate: gsap.quickTo(stage, "rotation", { duration: 0.55, ease: "power3.out" }),
      setCardRotateX: gsap.quickTo(card, "rotationX", { duration: 0.45, ease: "power3.out" }),
      setCardRotateY: gsap.quickTo(card, "rotationY", { duration: 0.45, ease: "power3.out" }),
      setLightX: gsap.quickTo(light, "x", { duration: 0.45, ease: "power3.out" }),
      setLightY: gsap.quickTo(light, "y", { duration: 0.45, ease: "power3.out" }),
      setShadow: (value: string) => {
        gsap.to(card, { boxShadow: value, duration: 0.35, overwrite: "auto", ease: "power2.out" });
      },
    };

    gsap.set(light, { scale: 2 });

    return () => {
      animationApi.current = {
        setStageRotate: null,
        setCardRotateX: null,
        setCardRotateY: null,
        setLightX: null,
        setLightY: null,
        setShadow: null,
      };
    };
  }, []);

  const applyTilt = useCallback((cardTiltX: number, cardTiltY: number, stageTilt: number) => {
    animationApi.current.setStageRotate?.(stageTilt);
    animationApi.current.setCardRotateX?.(cardTiltX);
    animationApi.current.setCardRotateY?.(cardTiltY);
    animationApi.current.setLightX?.(-cardTiltY * 6);
    animationApi.current.setLightY?.(-cardTiltX * 6);
    animationApi.current.setShadow?.(
      `${cardTiltY / 2}px ${20 + Math.abs(cardTiltY)}px 40px rgba(0,0,0,0.6)`,
    );
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;

    applyTilt(-y * 35, -x * 35, -x * 12);
  };

  const onLeave = () => {
    applyTilt(0, 0, 0);
    setHover(false);
  };

  const animateTapScale = (scale: number) => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, { scale, duration: 0.18, ease: "power2.out" });
  };

  const handleOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;

      setIsReceivingData((prev) => (prev ? prev : true));

      const getScreenAngle = () => {
        const screenAngle = (window.screen as ScreenWithOrientation).orientation?.angle;
        const legacyAngle = (window as LegacyOrientationWindow).orientation;
        const so = screenAngle ?? legacyAngle ?? 0;
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

      applyTilt(-simulatedMouseY * 35, -simulatedMouseX * 35, -simulatedMouseX * 12);
    },
    [applyTilt],
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
    <div className="vip-pass-shell" style={{ perspective: 1000 }}>
      <div ref={stageRef} className="vip-pass-stage">
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
              boxShadow: `0 0 12px ${ribbonShadow}`,
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.3) 50%, rgba(0,0,0,0.5) 100%)`,
            }}
          />
          {/* Ruban Droit */}
          <div
            className="vip-pass-lanyard-right"
            style={{
              transform: "rotate(12deg)",
              backgroundColor: accent,
              boxShadow: `0 0 12px ${ribbonShadow}`,
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
        <a
          ref={cardRef}
          href="#press-kit"
          download
          onPointerMove={onMove}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={onLeave}
          onPointerDown={() => animateTapScale(0.97)}
          onPointerUp={() => animateTapScale(1)}
          onPointerCancel={() => animateTapScale(1)}
          style={{ transformStyle: "preserve-3d", transformOrigin: "center top" }}
          className="vip-pass-card"
        >
          {isReceivingData && <div className="vip-pass-card-led" />}

          <div className="vip-pass-card-slot" />

          <div className="vip-pass-card-content">
            <div className="vip-pass-tagline" style={{ color: accent }}>
              ★ ALL ACCESS ★
            </div>
            <div className="vip-pass-title">VIP</div>
            <div className="vip-pass-subtitle">PRESS KIT</div>

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
                const barWidths = [
                  4, 1, 3, 2, 4, 2, 4, 1, 4, 3, 2, 4, 1, 4, 4, 2, 3, 1, 4, 4, 2, 4, 1, 3, 4, 2, 4,
                  1, 4, 3, 2, 4,
                ];
                const spaceWidths = [
                  2, 3, 2, 3, 2, 2, 3, 2, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 3, 2, 2, 3,
                  2, 3, 2, 3, 2,
                ];
                const barWidth = barWidths[i] ?? 2;
                const spaceWidth = i === 31 ? 0 : (spaceWidths[i] ?? 1);
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
            <div className="vip-pass-footnote">MEDIA ONLY · NON TRANSFERABLE</div>

            <div
              className={`vip-pass-download ${hover ? "is-hovered" : ""}`}
              style={{ color: downloadColor }}
            >
              <DownloadSimple size={14} weight="bold" /> DOWNLOAD .ZIP
            </div>
          </div>

          <div
            ref={lightRef}
            className="vip-pass-card-light"
            style={{ background: lightGradient }}
          />
        </a>
      </div>
    </div>
  );
}
