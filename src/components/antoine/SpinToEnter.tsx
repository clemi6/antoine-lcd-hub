import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

export function SpinToEnter({ onEnter }: { onEnter: () => void }) {
  const [open, setOpen] = useState(true);
  const rotate = useMotionValue(0);
  const startAngleRef = useState({ angle: 0, rot: 0 })[0];
  const [dragging, setDragging] = useState(false);

  // glow opacity tied to rotation
  const glow = useTransform(rotate, (r) => Math.min(Math.abs(r) / 45, 1));

  useEffect(() => {
    const unsub = rotate.on("change", (v) => {
      if (Math.abs(v) >= 45) close();
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    if (!open) return;
    setOpen(false);
    setTimeout(onEnter, 650);
  };

  const getAngle = (e: React.PointerEvent, rect: DOMRect) => {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    startAngleRef.angle = getAngle(e, rect);
    startAngleRef.rot = rotate.get();
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const a = getAngle(e, rect);
    let delta = a - startAngleRef.angle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    rotate.set(startAngleRef.rot + delta);
  };
  const onPointerUp = () => setDragging(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#050506]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="font-mono-tech text-[11px] tracking-[0.4em] text-white/60 mb-10 blink">
            SPIN OR TAP TO ENTER
          </div>

          <motion.div
            className="relative h-[280px] w-[280px] cursor-grab active:cursor-grabbing select-none touch-none"
            style={{ rotate }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClick={close}
          >
            {/* outer ring glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: "0 0 80px 10px rgba(0,255,204,0.35)",
                opacity: glow,
              }}
            />
            {/* vinyl */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 60%, #000 100%)",
                boxShadow:
                  "inset 0 0 40px rgba(0,0,0,0.9), 0 20px 60px rgba(0,0,0,0.8), inset 0 0 0 2px #1f1f1f",
              }}
            />
            {/* grooves */}
            {[...Array(18)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white/[0.04]"
                style={{
                  inset: `${10 + i * 6}px`,
                }}
              />
            ))}
            {/* center label */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[90px] w-[90px] rounded-full flex flex-col items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle, #00ffcc 0%, #009d80 60%, #004d3e 100%)",
                boxShadow: "0 0 25px rgba(0,255,204,0.5)",
              }}
            >
              <span className="font-display text-[#050506] text-2xl leading-none">LCD</span>
              <span className="font-mono-tech text-[7px] text-[#050506]/70 mt-1 tracking-widest">
                33 ⅓ RPM
              </span>
              <div className="absolute h-3 w-3 rounded-full bg-[#050506]" />
            </div>
            {/* tonearm hint marker */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#00ffcc] shadow-[0_0_10px_#00ffcc]" />
          </motion.div>

          <div className="font-mono-tech text-[10px] tracking-[0.3em] text-white/30 mt-12">
            ANTOINE LCD // EST. 2018
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}