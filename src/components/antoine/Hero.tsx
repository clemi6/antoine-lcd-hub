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
      className="fixed inset-0 z-70 overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(19,23,35,0.98)_0%,rgba(5,6,8,0.99)_52%,#000_100%)] text-white"
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,204,0.12),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_28%,rgba(0,0,0,0.22))]" />
      <div
        className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_65%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.2)_55%,rgba(0,0,0,0.6)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-cyan-300/8 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 top-[18vh] z-20 hidden px-6 text-center sm:block">
        <div className="mx-auto max-w-5xl text-[clamp(3.8rem,12vw,9rem)] leading-[0.8] tracking-[0.12em] text-white/12 drop-shadow-[0_0_45px_rgba(0,255,204,0.12)]">
          {title}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-[22vh] z-20 px-6 text-center sm:hidden">
        <div className="text-[clamp(2.8rem,18vw,5rem)] leading-[0.8] tracking-[0.08em] text-white/12">
          {title}
        </div>
      </div>

      <Canvas
        dpr={[1, 2]}
        shadows={false}
        camera={{ position: [0, 0, 8.2], fov: 36 }}
        className="absolute inset-0"
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

      <div
        ref={usbStageRef}
        className="pointer-events-none absolute inset-x-0 bottom-[18vh] mx-auto flex w-full max-w-160 items-center justify-center px-6 opacity-0 sm:bottom-[22vh]"
      >
        <div className="relative h-28 w-full max-w-104">
          <div className="absolute right-0 top-4 h-16 w-42 rounded-[1.3rem] border border-white/10 bg-[linear-gradient(180deg,#101214_0%,#050608_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_60px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-y-2 right-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,255,204,0.9)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/60 shadow-[0_0_10px_rgba(0,255,204,0.55)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/35" />
            </div>
            <div className="absolute inset-x-3 top-1/2 h-6 -translate-y-1/2 rounded-[0.9rem] border border-white/5 bg-black/60" />
            <div className="absolute inset-x-4 bottom-3 h-1 rounded-full bg-white/10" />
          </div>

          <div
            ref={usbStickRef}
            className="absolute left-0 top-6 flex h-10 w-[16rem] items-stretch rounded-3xl border border-white/8 bg-[linear-gradient(180deg,#262b30_0%,#0d1014_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
            style={{ willChange: "transform" }}
          >
            <div className="w-14 rounded-l-3xl bg-[linear-gradient(180deg,#b2bbc4_0%,#5f6872_48%,#222831_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
              <div className="mx-auto mt-3 h-4 w-8 rounded-[0.45rem] border border-black/25 bg-black/25" />
            </div>
            <div className="relative flex-1 overflow-hidden rounded-r-3xl">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),transparent_22%,transparent_78%,rgba(255,255,255,0.06))]" />
              <div className="absolute inset-y-2 left-3 right-4 rounded-[0.8rem] border border-white/5 bg-[linear-gradient(180deg,#121419_0%,#07080b_100%)]" />
              <div className="absolute left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,255,204,0.95)]" />
              <div className="absolute left-8 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-300/60 shadow-[0_0_12px_rgba(0,255,204,0.6)]" />
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 px-6 text-center sm:bottom-10">
        <div className="font-mono-tech text-[10px] tracking-[0.46em] text-white/55 sm:hidden animate-pulse">
          TAP TO ENTER
        </div>
        <div className="hidden font-mono-tech text-[10px] tracking-[0.46em] text-white/55 sm:block animate-pulse">
          CLICK TO ENTER
        </div>
        <div className="max-w-88 text-[0.72rem] uppercase tracking-[0.28em] text-white/24">
          {title} // Club interface ready
        </div>
      </div>

      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-20 opacity-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,1) 0%, rgba(208,246,255,0.95) 18%, rgba(0,255,204,0.42) 40%, rgba(255,255,255,0) 72%)",
          filter: "blur(12px)",
        }}
      />
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
