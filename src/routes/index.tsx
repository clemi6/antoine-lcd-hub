import { createFileRoute } from "@tanstack/react-router";
import { VipPass } from "@/components/antoine/VipPass";
import { SocialLinks } from "@/components/antoine/SocialLinks";
import { motion } from "framer-motion";
import "./routes.css";
import wankidPhoto1 from "@/assets/ANTOINE_LCD_12-25-55.jpg";
import wankidPhoto2 from "@/assets/ANTOINE_LCD_12-25-56.jpg";
import wankidPhoto3 from "@/assets/ANTOINE_LCD_12-25-6.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const photos = [wankidPhoto1, wankidPhoto2, wankidPhoto3];

function Index() {
  return (
    <div className="app-shell">
      <main className="app-main is-visible">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="wankid-container"
        >
          <Header />
          <Gallery />
          <SocialLinks />
          <VipPass />
        </motion.div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <motion.header 
      className="wankid-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="wankid-header-content">
        <img 
          src={wankidPhoto1} 
          alt="WANKID" 
          className="wankid-hero-image"
        />
        <h1 className="wankid-title">WANKID</h1>
      </div>
    </motion.header>
  );
}

function Gallery() {
  return (
    <motion.section 
      className="wankid-gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="gallery-grid">
        {photos.map((photo, idx) => (
          <motion.div
            key={idx}
            className="gallery-item"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 + idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <img 
              src={photo} 
              alt={`WANKID ${idx + 1}`}
              loading="lazy"
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
