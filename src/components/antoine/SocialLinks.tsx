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
import "./antoine.css";

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
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="social-card"
          >
            <div className="social-card-ripple" />
            <div className="social-card-body">
              <div>
                <div className="social-card-meta">SOCIAL</div>
                <div className="social-card-name">{social.name}</div>
              </div>
              <div className="social-card-icon">
                <Icon size={20} />
              </div>
            </div>
          </motion.a>
        );
      })}
    </motion.nav>
  );
}
