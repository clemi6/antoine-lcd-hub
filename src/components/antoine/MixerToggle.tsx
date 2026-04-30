import { motion } from "framer-motion";
import { useTheme } from "./ThemeContext";

export function MixerToggle() {
  const { isAfterparty, setIsAfterparty } = useTheme();
  return (
    <div className="flex items-center justify-between gap-4 px-1 py-3">
      <span
        className={`font-mono-tech text-[10px] tracking-[0.3em] transition-colors ${
          !isAfterparty ? "text-[#00ffcc]" : "text-white/30"
        }`}
      >
        MAINSTAGE
      </span>

      <button
        onClick={() => setIsAfterparty(!isAfterparty)}
        aria-label="Toggle theme"
        className="relative h-9 w-20 rounded-md border border-white/10 bg-[#0a0a0e] shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] flex items-center px-1"
      >
        {/* track marks */}
        <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-white/5" />
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 700, damping: 35 }}
          className="relative h-7 w-7 rounded-[4px]"
          style={{
            marginLeft: isAfterparty ? "calc(100% - 1.75rem - 0.25rem)" : 0,
            background: isAfterparty
              ? "linear-gradient(180deg, #ff5577 0%, #cc0022 50%, #660011 100%)"
              : "linear-gradient(180deg, #66ffe0 0%, #00ffcc 50%, #006a55 100%)",
            boxShadow: isAfterparty
              ? "0 0 14px rgba(255,0,51,0.6), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.5)"
              : "0 0 14px rgba(0,255,204,0.5), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.5)",
          }}
        >
          <div className="absolute inset-x-1 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-black/40" />
        </motion.div>
      </button>

      <span
        className={`font-mono-tech text-[10px] tracking-[0.3em] transition-colors ${
          isAfterparty ? "text-[#ff0033]" : "text-white/30"
        }`}
      >
        AFTER
      </span>
    </div>
  );
}