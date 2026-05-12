import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import * as orientation from "../lib/orientation";
import "./EnableMotionPrompt.css";

const PROMPT_TEXT: Record<string, any> = {
  fr: {
    label: "EXPÉRIENCE INTERACTIVE",
    title: "Capteurs de mouvement",
    text:
      "Autorise les capteurs de mouvement pour débloquer l'expérience 3D interactive du Pass VIP sur ton appareil.",
    accept: "OUI, ACTIVER",
    decline: "NON, RESTER INACTIF",
  },
  en: {
    label: "INTERACTIVE EXPERIENCE",
    title: "Device Motion",
    text: "Enable motion sensors to unlock the 3D interactive VIP pass experience on your device.",
    accept: "YES, ENABLE",
    decline: "NO, STAY STILL",
  },
};

export default function EnableMotionPrompt() {
  const [visible, setVisible] = useState(false);
  const [lang, setLang] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem("wankid-lang");
      if (saved === "fr" || saved === "en") return saved;
    } catch (e) {}
    return typeof navigator !== "undefined" && navigator.language && navigator.language.startsWith("fr") ? "fr" : "en";
  });

  useEffect(() => {
    const onLangChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as string | undefined;
      if (detail === "fr" || detail === "en") setLang(detail);
      else {
        try {
          const saved = window.localStorage.getItem("wankid-lang");
          if (saved === "fr" || saved === "en") setLang(saved);
        } catch (err) {}
      }
    };
    window.addEventListener("wankid-lang-changed", onLangChange as EventListener);
    return () => window.removeEventListener("wankid-lang-changed", onLangChange as EventListener);
  }, []);

  useEffect(() => {
    // Show prompt only if device needs permission and user didn't opt-out
    const optedOut = (() => {
      try {
        return window.localStorage.getItem("wankid-motion-optout") === "1";
      } catch (e) {
        return false;
      }
    })();

    if (optedOut) {
      setVisible(false);
      return;
    }

    if (orientation.hasPermissionAPI() && !orientation.isGranted()) {
      setVisible(true);
    } else {
      // no permission API -> initialize silently unless opted-out
      orientation.requestPermission().catch(() => {});
      setVisible(false);
    }
  }, []);

  const handleAccept = async () => {
    // clear opt-out if present
    try {
      window.localStorage.removeItem("wankid-motion-optout");
    } catch (e) {}
    await orientation.requestPermission().catch(() => {});
    // notify other components that permission state may have changed
    try {
      window.dispatchEvent(new CustomEvent("wankid-motion-granted"));
    } catch (e) {}
    setVisible(false);
  };

  const handleDecline = () => {
    // set opt-out so VipPass will stay static
    try {
      window.localStorage.setItem("wankid-motion-optout", "1");
    } catch (e) {}
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
            <button onClick={handleDecline} className="motion-prompt-close" aria-label="Close">
              <X size={20} weight="bold" />
            </button>

            <div className="motion-prompt-label">{PROMPT_TEXT[lang].label}</div>

            <h2 className="motion-prompt-title">{PROMPT_TEXT[lang].title}</h2>

            <p className="motion-prompt-text">{PROMPT_TEXT[lang].text}</p>

            <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
              <button onClick={handleAccept} className="motion-prompt-button" style={{ flex: 1 }}>
                {PROMPT_TEXT[lang].accept}
              </button>
              <button
                onClick={handleDecline}
                className="motion-prompt-button"
                style={{ flex: 1, background: "rgba(255,255,255,0.04)" }}
              >
                {PROMPT_TEXT[lang].decline}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
