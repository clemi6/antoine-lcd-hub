import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  FaBandcamp,
  FaInstagram,
  FaSoundcloud,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";
import socials from "@/data/socials.json";

const iconMap: Record<string, IconType> = {
  FaInstagram,
  FaTiktok,
  FaSoundcloud,
  FaBandcamp,
  FaYoutube,
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export function SocialLinks() {
  return (
    <motion.nav
      variants={listVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 sm:grid-cols-5"
      aria-label="Social links"
    >
      {socials.map((social) => {
        const Icon = iconMap[social.icon] ?? FaInstagram;

        return (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/4 px-4 py-4 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,204,0.18),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <div className="font-mono-tech text-[9px] tracking-[0.35em] text-white/35">
                  SOCIAL
                </div>
                <div className="font-display text-[28px] leading-none text-white">
                  {social.name}
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/85 transition-colors duration-300 group-hover:bg-[#00ffcc] group-hover:text-black">
                <Icon size={20} />
              </div>
            </div>
          </motion.a>
        );
      })}
    </motion.nav>
  );
}
