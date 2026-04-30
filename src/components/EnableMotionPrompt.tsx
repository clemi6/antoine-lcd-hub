import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import * as orientation from "../lib/orientation";

export default function EnableMotionPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Si l'API de permission existe (iOS) et qu'elle n'est pas encore accordée
    if (orientation.hasPermissionAPI() && !orientation.isGranted()) {
      setVisible(true);
    } else {
      // Si la plateforme n'a pas besoin de permission (PC, Android),
      // on initialise silencieusement en arrière-plan
      orientation.requestPermission().catch(() => {});
      setVisible(false);
    }
  }, []);

  const handleEnable = async () => {
    const ok = await orientation.requestPermission();
    // Qu'il accepte ou refuse au niveau du système iOS, on cache notre pop-up HTML
    setVisible(false);
  };

  const handleDecline = () => {
    // L'utilisateur clique sur la croix, on ferme le pop-up sans rien demander
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-[#0e0e14] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl"
          >
            {/* La croix pour fermer/refuser */}
            <button
              onClick={handleDecline}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5"
              aria-label="Close"
            >
              <X size={20} weight="bold" />
            </button>

            {/* Si tu as accès à useTheme() ici, tu peux remplacer text-emerald-400 par style={{ color: accent }} */}
            <div className="font-mono-tech text-[10px] tracking-[0.3em] mb-4 text-emerald-400">
              INTERACTIVE EXPERIENCE
            </div>

            <h2 className="font-display text-white text-2xl mb-2">Device Motion</h2>

            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Enable motion sensors to unlock the 3D interactive VIP pass experience on your device.
            </p>

            <button
              onClick={handleEnable}
              className="w-full py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono-tech text-xs tracking-[0.2em] transition-all"
            >
              ENABLE MOTION
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
