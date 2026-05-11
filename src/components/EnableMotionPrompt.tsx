import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import * as orientation from "../lib/orientation";
import "./EnableMotionPrompt.css";

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
          className="motion-prompt-backdrop"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="motion-prompt-card"
          >
            {/* La croix pour fermer/refuser */}
            <button onClick={handleDecline} className="motion-prompt-close" aria-label="Close">
              <X size={20} weight="bold" />
            </button>

            {/* Si tu as accès à useTheme() ici, tu peux remplacer text-emerald-400 par style={{ color: accent }} */}
            <div className="motion-prompt-label">INTERACTIVE EXPERIENCE</div>

            <h2 className="motion-prompt-title">Device Motion</h2>

            <p className="motion-prompt-text">
              Enable motion sensors to unlock the 3D interactive VIP pass experience on your device.
            </p>

            <button onClick={handleEnable} className="motion-prompt-button">
              ENABLE MOTION
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
