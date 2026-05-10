import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  FaBandcamp,
  FaInstagram,
  FaSoundcloud,
  FaTiktok,
  FaYoutube,
  FaSpotify,
  FaDeezer,
  FaApple,
} from "react-icons/fa6";
import socials from "@/data/socials.json";
import "./antoine.css";

const iconMap: Record<string, IconType> = {
  FaInstagram,
  FaTiktok,
  FaSoundcloud,
  FaBandcamp,
  FaYoutube,
  FaSpotify,
  FaDeezer,
  FaApple,
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
      className="social-links-grid"
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="social-icon-link"
            title={social.name}
          >
            <Icon size={32} />
          </motion.a>
        );
      })}
    </motion.nav>
  );
}
