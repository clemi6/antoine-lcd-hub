import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { gsap } from "gsap";
import * as THREE from "three";
import {
  addOrientationListener,
  hasPermissionAPI,
  isGranted,
  removeOrientationListener,
  requestPermission,
} from "@/lib/orientation";
import "./antoine.css";

type HeroProps = {
  title?: string;
  onEnter: () => void;
};

type MotionTarget = {
  x: number;
  y: number;
};

const HERO_ACCENT = "#00ffcc";

export function Hero({ title = "ANTOINE LCD", onEnter }: HeroProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const titleGroupRef = useRef<THREE.Group>(null);
  const usbStageRef = useRef<HTMLDivElement>(null);
  const usbStickRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const transitionLockRef = useRef(false);
  const pointerTargetRef = useRef<MotionTarget>({ x: 0, y: 0 });
  const deviceTargetRef = useRef<MotionTarget>({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (event.gamma === null || event.beta === null) return;

    const tiltX = Math.max(-1, Math.min(1, (event.gamma ?? 0) / 32));
    const tiltY = Math.max(-1, Math.min(1, (event.beta ?? 0) / 38));
    deviceTargetRef.current = { x: tiltX, y: tiltY };
  }, []);

  useEffect(() => {
    if (!hasPermissionAPI()) {
      void requestPermission().then((granted) => {
        if (granted) addOrientationListener(handleOrientation);
      });
      return () => removeOrientationListener(handleOrientation);
    }

    if (isGranted()) {
      addOrientationListener(handleOrientation);
    }

    return () => removeOrientationListener(handleOrientation);
  }, [handleOrientation]);

  useEffect(() => {
    if (!shellRef.current || !mounted) return;

    gsap.fromTo(
      shellRef.current,
      { opacity: 0, filter: "blur(14px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out" },
    );
  }, [mounted]);

  const updatePointerTarget = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = shellRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    pointerTargetRef.current = {
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    };
  };

  const runEnterSequence = async () => {
    if (transitionLockRef.current || isTransitioning || !titleGroupRef.current) return;

    transitionLockRef.current = true;
    setIsTransitioning(true);

    if (hasPermissionAPI() && !isGranted()) {
      const granted = await requestPermission();
      if (granted) addOrientationListener(handleOrientation);
    } else {
      void requestPermission();
    }

    const titleGroup = titleGroupRef.current;
    const usbStage = usbStageRef.current;
    const usbStick = usbStickRef.current;
    const flash = flashRef.current;
    const shell = shellRef.current;

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

    // Increased durations to slow down the enter transition (approx 2x slower)
    tl.to(titleGroup.scale, { x: 1.75, y: 1.75, z: 1.75, duration: 0.56 }, 0)
      .to(titleGroup.position, { z: 2.75, duration: 0.56 }, 0)
      .to(titleGroup.rotation, { y: "+=0.7", x: "+=0.12", duration: 0.56 }, 0)
      .to(usbStage, { opacity: 1, duration: 0.1 }, 0.36)
      .fromTo(
        usbStick,
        { x: "-34vw", y: "1.8rem", rotate: -8 },
        { x: "8vw", y: 0, rotate: 0, duration: 0.76, ease: "power4.out" },
        0.48,
      )
      .to(
        usbStage,
        {
          boxShadow: "0 0 0 1px rgba(0,255,204,0.25), 0 0 60px rgba(0,255,204,0.18)",
          duration: 0.36,
        },
        0.76,
      )
      .to(flash, { opacity: 0.96, duration: 0.16, ease: "none" }, 1.16)
      .to(
        flash,
        {
          opacity: 0,
          duration: 0.84,
          ease: "power2.out",
          onStart: () => {
            if (shell) {
              shell.style.background =
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.96) 0%, rgba(187,241,255,0.9) 22%, rgba(0,255,204,0.45) 45%, rgba(0,0,0,0) 78%)";
            }
          },
        },
        1.32,
      )
      .to(
        shell,
        {
          opacity: 0,
          duration: 0.84,
          ease: "power2.out",
          onComplete: () => {
            onEnter();
            setMounted(false);
          },
        },
        1.6,
      );
  };

  if (!mounted) return null;

  return (
    <div
      ref={shellRef}
      className="hero-shell"
      style={{ touchAction: "manipulation" }}
      onPointerMove={updatePointerTarget}
      onPointerDown={updatePointerTarget}
      onClick={runEnterSequence}
      aria-label="Enter the site"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          void runEnterSequence();
        }
      }}
    >
      <div className="hero-shell-inner">
        <div className="hero-shell-gradient" />
        <div className="hero-shell-grid" />
        <div className="hero-shell-vignette" />
        <div className="hero-top-fade" />

        <div className="hero-title-desktop">
          <div className="hero-title-text-desktop">{title}</div>
        </div>
        <div className="hero-title-mobile">
          <div className="hero-title-text-mobile">{title}</div>
        </div>

        <Canvas
          dpr={[1, 2]}
          shadows={false}
          camera={{ position: [0, 0, 8.2], fov: 36 }}
          className="hero-canvas"
        >
          <color attach="background" args={["#07080b"]} />
          <fog attach="fog" args={["#07080b", 10, 22]} />
          <ambientLight intensity={0.55} />
          <pointLight position={[-5, 3, 6]} intensity={6} color={HERO_ACCENT} />
          <pointLight position={[5, -2, 4]} intensity={4} color="#e8f6ff" />
          <spotLight position={[0, 6, 7]} angle={0.45} penumbra={1} intensity={12} color="#ffffff" />
          <Environment preset="city" />
          <HeroTitle
            ref={titleGroupRef}
            title={title}
            pointerTargetRef={pointerTargetRef}
            deviceTargetRef={deviceTargetRef}
          />
        </Canvas>

        <div ref={usbStageRef} className="hero-usb-stage">
          <div className="hero-usb-stage-shell">
            <div className="hero-usb-head">
              <div className="hero-usb-head-indicators">
                <span className="hero-usb-indicator hero-usb-indicator--primary" />
                <span className="hero-usb-indicator hero-usb-indicator--secondary" />
                <span className="hero-usb-indicator hero-usb-indicator--tertiary" />
              </div>
              <div className="hero-usb-head-port" />
              <div className="hero-usb-head-base" />
            </div>

            <div ref={usbStickRef} className="hero-usb-stick" style={{ willChange: "transform" }}>
              <div className="hero-usb-plug">
                <div className="hero-usb-plug-chip" />
              </div>
              <div className="hero-usb-body">
                <div className="hero-usb-body-glow" />
                <div className="hero-usb-body-panel" />
                <div className="hero-usb-body-led" />
                <div className="hero-usb-body-led-secondary" />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-enter-hint">
          <div className="hero-enter-hint-mobile">TAP TO ENTER</div>
          <div className="hero-enter-hint-desktop">CLICK TO ENTER</div>
          <div className="hero-enter-caption">{title} // Club interface ready</div>
        </div>

        <div
          ref={flashRef}
          className="hero-flash"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(208,246,255,0.95) 18%, rgba(0,255,204,0.42) 40%, rgba(255,255,255,0) 72%)",
            filter: "blur(12px)",
          }}
        />
      </div>
    </div>
  );
}

type HeroTitleProps = {
  title: string;
  pointerTargetRef: React.RefObject<MotionTarget>;
  deviceTargetRef: React.RefObject<MotionTarget>;
};

const HeroTitle = forwardRef<THREE.Group, HeroTitleProps>(function HeroTitle(
  { title, pointerTargetRef, deviceTargetRef },
  ref,
) {
  const textGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const group = textGroupRef.current;
    if (!group) return;

    const pointer = pointerTargetRef.current ?? { x: 0, y: 0 };
    const device = deviceTargetRef.current ?? { x: 0, y: 0 };
    const targetX = -((pointer.y * 0.28) + device.y * 0.22);
    const targetY = pointer.x * 0.42 + device.x * 0.18 + state.clock.elapsedTime * 0.18;

    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, targetX, 4.5, delta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, targetY, 4.5, delta);
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      Math.sin(state.clock.elapsedTime * 0.9) * 0.1,
      3.5,
      delta,
    );
  });

  return (
    <group ref={ref} scale={1} position={[0, 0, 0]}>
      <group ref={textGroupRef}>
        <group position={[0, 0.2, 0]}>
          <mesh position={[0, 0, -0.18]} scale={[7.6, 1.9, 0.24]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0b0d11" metalness={0.85} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0, 0]} scale={[7.1, 1.45, 0.12]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#141820" metalness={0.95} roughness={0.18} emissive="#061019" emissiveIntensity={0.85} />
          </mesh>
          <mesh position={[0, 0, 0.08]} scale={[6.45, 0.92, 0.08]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#1f2530" metalness={0.8} roughness={0.16} />
          </mesh>
          <mesh position={[0, -1.12, -0.08]} rotation={[0.1, 0, 0]} scale={[6.1, 0.18, 1]}>
            <planeGeometry />
            <meshBasicMaterial color={HERO_ACCENT} transparent opacity={0.12} />
          </mesh>
          <mesh position={[0, 0, 0.16]} rotation={[0, 0, 0.08]} scale={[3.9, 0.34, 0.12]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#eef6fb" metalness={1} roughness={0.14} emissive="#0c1a23" emissiveIntensity={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.28]} rotation={[0, 0, -0.08]} scale={[2.5, 0.22, 0.08]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0b0f13" metalness={1} roughness={0.12} />
          </mesh>
          <mesh position={[0, 0.62, 0.1]} rotation={[0, 0, -0.1]} scale={[0.9, 0.9, 0.9]}>
            <icosahedronGeometry args={[0.52, 0]} />
            <meshStandardMaterial color={HERO_ACCENT} emissive={HERO_ACCENT} emissiveIntensity={0.8} metalness={0.2} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
});
