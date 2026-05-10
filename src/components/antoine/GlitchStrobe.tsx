import { useState, useCallback } from "react";

/**
 * Hook returning a className + trigger for glitch + strobe effects.
 * Strobe is mounted as a fixed overlay so the WHOLE screen flashes.
 */
export function useStrobe() {
  const [active, setActive] = useState(false);
  const trigger = useCallback(() => {
    setActive(true);
    setTimeout(() => setActive(false), 180);
  }, []);
  return { active, trigger };
}

export function StrobeLayer({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div
      className="strobe-active"
      style={{ background: "white" }}
    />
  );
}

export function useGlitch() {
  const [glitch, setGlitch] = useState(false);
  const fire = useCallback(() => {
    setGlitch(false);
    requestAnimationFrame(() => setGlitch(true));
    setTimeout(() => setGlitch(false), 380);
  }, []);
  return { className: glitch ? "glitch-active" : "", fire };
}