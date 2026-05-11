import { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
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

const CARD_REST_SHADOW = "0px 20px 40px rgba(0,0,0,0.6)";
const POINTER_TILT = 35;
const POINTER_SWING = 12;
const POINTER_LIGHT_MULTIPLIER = 6;
const MOBILE_TILT = 56;
const MOBILE_SWING = 22;
const MOBILE_CENTER_DEADZONE = 10;
const MOBILE_CENTER_STABLE_READINGS = 3;
const MOBILE_CENTER_TILT = 1.8;
const MOBILE_CENTER_SWING = 5;
const MOBILE_NONLATERAL_TILT = 14;
const MOBILE_CENTER_SWING_AMP = 6;
const CROSS_AXIS_SUPPRESSION = 0.8; // how much to suppress lateral movement when forward tilt is strong (0..1)
const RELEASE_OVERSHOOT_MAX = 6;
const RELEASE_OVERSHOOT_FACTOR = 0.28;
const RELEASE_OVERSHOOT_FALLBACK = 4.2;
const RELEASE_OUT_DURATION = 0.2;
const RELEASE_RETURN_DURATION = 0.88;
const BAR_WIDTHS = [
  4, 1, 3, 2, 4, 2, 4, 1, 4, 3, 2, 4, 1, 4, 4, 2, 3, 1, 4, 4, 2, 4, 1, 3, 4, 2, 4, 1, 4, 3, 2, 4,
];
const SPACE_WIDTHS = [
  2, 3, 2, 3, 2, 2, 3, 2, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 3, 2, 2, 3, 2, 3, 2, 3, 2,
];

export function VipPass({ theme = "light" }: VipPassProps) {
  const accent = theme === "dark" ? "#63dbc4" : "#c7a575";
  const ribbonShadow = theme === "dark" ? `${accent}52` : `${accent}40`;
  const lightGradient =
    theme === "dark"
      ? "linear-gradient(135deg, transparent 40%, rgba(99,219,196,0.22) 50%, transparent 60%)"
      : "linear-gradient(135deg, transparent 40%, rgba(199,165,117,0.22) 50%, transparent 60%)";

  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const cardLightRef = useRef<HTMLDivElement>(null);

  const [hover, setHover] = useState(false);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const mobileStableReadingsRef = useRef(0);
  const mobileCenterLockRef = useRef(false);

  const downloadColor = hover
    ? accent
    : theme === "dark"
      ? "rgba(244,243,239,0.7)"
      : "rgba(43,34,23,0.62)";

  const initialOrientation = useRef<{ x: null | number; y: null | number }>({
    x: null,
    y: null,
  });
  const lastOrientationAngleRef = useRef<number | null>(null);

  const animatePass = useCallback((nextRotX: number, nextRotY: number, nextSwing: number) => {
    const card = cardRef.current;
    const stage = stageRef.current;
    const light = cardLightRef.current;

    if (stage) {
      gsap.to(stage, {
        rotate: nextSwing,
        duration: 0.45,
        ease: "power3.out",
        overwrite: true,
      });
    }

    if (card) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: nextRotY,
        boxShadow: `${nextRotY / 2}px ${20 + Math.abs(nextRotY)}px 40px rgba(0,0,0,0.6)`,
        duration: 0.35,
        ease: "power3.out",
        overwrite: true,
      });
    }

    if (light) {
      gsap.to(light, {
          x: -nextRotY * POINTER_LIGHT_MULTIPLIER,
          y: -nextRotX * POINTER_LIGHT_MULTIPLIER,
        scale: 2,
        duration: 0.35,
        ease: "power3.out",
        overwrite: true,
      });
    }
  }, []);

  const settlePass = useCallback(() => {
    const card = cardRef.current;
    const stage = stageRef.current;
    const light = cardLightRef.current;

    if (card) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        boxShadow: CARD_REST_SHADOW,
        duration: 0.42,
        ease: "power3.out",
        overwrite: true,
      });
    }

    if (light) {
      gsap.to(light, {
        x: 0,
        y: 0,
        scale: 2,
        duration: 0.42,
        ease: "power3.out",
        overwrite: true,
      });
    }

    if (stage) {
      const currentSwing = Number(gsap.getProperty(stage, "rotate")) || 0;
      const overshoot = gsap.utils.clamp(
        -RELEASE_OVERSHOOT_MAX,
        RELEASE_OVERSHOOT_MAX,
        currentSwing * -RELEASE_OVERSHOOT_FACTOR || RELEASE_OVERSHOOT_FALLBACK,
      );

      gsap.killTweensOf(stage);
      gsap
        .timeline({ defaults: { overwrite: true } })
        .to(stage, {
          rotate: overshoot,
          duration: RELEASE_OUT_DURATION,
          ease: "power2.out",
        })
        .to(stage, {
          rotate: 0,
          duration: RELEASE_RETURN_DURATION,
          ease: "elastic.out(1, 0.35)",
        });
    }
  }, []);

  const settleMobilePass = useCallback(() => {
    const card = cardRef.current;
    const stage = stageRef.current;
    const light = cardLightRef.current;

    mobileCenterLockRef.current = true;

    if (card) {
      gsap.to(card, {
        scale: 1,
        boxShadow: CARD_REST_SHADOW,
        duration: 0.2,
        ease: "power2.out",
        overwrite: true,
      });
    }

    if (light) {
      gsap.to(light, {
        x: 0,
        y: 0,
        scale: 2,
        duration: 0.36,
        ease: "power3.out",
        overwrite: true,
      });
    }

    if (stage) {
      const currentSwing = Number(gsap.getProperty(stage, "rotate")) || 0;
      const overshoot = gsap.utils.clamp(
        -MOBILE_CENTER_SWING,
        MOBILE_CENTER_SWING,
        currentSwing * -0.22 || MOBILE_CENTER_SWING,
      );

      gsap.killTweensOf(stage);
      gsap
        .timeline({ defaults: { overwrite: true } })
        .to(stage, {
          rotate: overshoot,
          duration: 0.14,
          ease: "power2.out",
        })
        .to(stage, {
          rotate: 0,
          duration: 0.72,
          ease: "elastic.out(1, 0.42)",
          onComplete: () => {
            mobileCenterLockRef.current = false;
          },
        });
    } else {
      mobileCenterLockRef.current = false;
    }
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const light = cardLightRef.current;

    if (stage) {
      gsap.set(stage, { rotate: 0, transformOrigin: "center top" });
    }

    if (card) {
      gsap.set(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        transformOrigin: "center top",
        transformStyle: "preserve-3d",
        boxShadow: CARD_REST_SHADOW,
      });
    }

    if (light) {
      gsap.set(light, { x: 0, y: 0, scale: 2 });
    }

    return () => {
      gsap.killTweensOf([stage, card, light]);
    };
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    animatePass(0, -x * POINTER_TILT, -x * POINTER_SWING);
  };

  const onLeave = () => {
    settlePass();
    setHover(false);
  };

  const onPressStart = () => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 0.97,
        duration: 0.12,
        ease: "power2.out",
        overwrite: true,
      });
    }
  };

  const onPressEnd = () => {
    settlePass();
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

      if (lastOrientationAngleRef.current !== null && lastOrientationAngleRef.current !== angle) {
        lastOrientationAngleRef.current = angle;
        initialOrientation.current = { x: normX, y: normY };
        mobileStableReadingsRef.current = 0;
        mobileCenterLockRef.current = false;
        settleMobilePass();
        return;
      }

      lastOrientationAngleRef.current = angle;

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

      // Consider non-tilt only on the lateral axis: if there's no left/right tilt,
      // keep lateral locked to center while still allowing a small forward/back tilt.
      const isLaterallyNearCenter = Math.abs(deltaX) <= MOBILE_CENTER_DEADZONE;

      if (isLaterallyNearCenter) {
        mobileStableReadingsRef.current += 1;
        if (mobileStableReadingsRef.current >= MOBILE_CENTER_STABLE_READINGS) {
          // lock lateral axis and allow a subtle forward/back swing ONLY (no rotateX)
          mobileCenterLockRef.current = true;
          const limitedY = Math.max(-1, Math.min(1, simulatedMouseY));
          // no rotateX, no rotateY; only stage swing based on Y
          animatePass(0, 0, -limitedY * MOBILE_CENTER_SWING_AMP);
          return;
        }
      } else {
        mobileStableReadingsRef.current = 0;
        mobileCenterLockRef.current = false;
      }

      // Cross-axis dampening: when the device is tilted strongly forward/back (Y),
      // reduce the lateral (X) response to avoid the card shooting left/right.
      const suppression = Math.max(0, 1 - Math.abs(simulatedMouseY) * CROSS_AXIS_SUPPRESSION);
      const effectiveSimX = Math.max(-1, Math.min(1, simulatedMouseX * suppression));
      const effectiveSimY = Math.max(-1, Math.min(1, simulatedMouseY));

      animatePass(
        -effectiveSimY * MOBILE_TILT,
        -effectiveSimX * MOBILE_TILT,
        -effectiveSimX * MOBILE_SWING,
      );
    },
    [animatePass, settleMobilePass],
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
          onPointerDown={onPressStart}
          onPointerUp={onPressEnd}
          onPointerCancel={onPressEnd}
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
                const barWidth = BAR_WIDTHS[i] ?? 2;
                const spaceWidth = i === 31 ? 0 : (SPACE_WIDTHS[i] ?? 1);
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
            ref={cardLightRef}
            className="vip-pass-card-light"
            style={{ background: lightGradient }}
          />
        </a>
      </div>
    </div>
  );
}
