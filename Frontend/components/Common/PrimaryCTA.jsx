import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   MULTILAYER CTA BUTTON
   Multiple color layers that fill from bottom → top
   with staggered delays on hover
   ═══════════════════════════════════════════════════════════════ */
export const LayerHoverStyle = () => (
  <style>{`
    .group:hover .absolute[aria-hidden="true"][style*="scaleY(0)"] {
      transform: scaleY(1) !important;
    }
    @keyframes glow-pulse {
      0% { transform: scale(1.1); opacity: 0.5; }
      50% { transform: scale(1.25); opacity: 0.8; }
      100% { transform: scale(1.1); opacity: 0.5; }
    }
    .hover-glow {
      animation: glow-pulse 2s infinite ease-in-out;
    }
  `}</style>
);

const PrimaryCTA = ({ children, to, delay = 0, className = "", accentColor = "#E74C3C" }) => {
  const layers = [
    { color: "#FF4D4D", delay: "0s" },    // Coral
    { color: "#D7EEDD", delay: "0.07s" }, // Green
    { color: "#8A4FFF", delay: "0.14s" }, // Purple
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.76, 0, 0.24, 1] }}
      className={className}
    >
      <Link to={to} className="group relative inline-block">
        <span
          className="relative z-10 inline-flex items-center gap-2.5 rounded-full px-9 py-[18px] md:px-11 md:py-[22px] font-medium text-[15px] md:text-base overflow-hidden transition-colors duration-300 ease-smooth group-hover:text-white shadow-xl shadow-black/5"
          style={{
            backgroundColor: "#FFFFFF",
            color: "#1A1A1A",
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 500,
            letterSpacing: "0.03em",
          }}
        >
          {/* Color fill layers — each fills from bottom to top on hover */}
          {layers.map((layer, i) => (
            <span
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: layer.color,
                transform: "scaleY(0)",
                transformOrigin: "bottom",
                transition: `transform 0.45s cubic-bezier(0.76, 0, 0.24, 1) ${layer.delay}`,
                zIndex: i + 1,
              }}
              aria-hidden="true"
            />
          ))}

          {/* Shimmer Light Effect */}
          <span 
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out z-20" 
            style={{ pointerEvents: "none" }}
          />

          {/* Text content — above layers */}
          <span className="relative z-30 flex items-center gap-2.5 transition-transform duration-300 group-hover:scale-105">
            {children}
            <svg
              className="w-4 h-4 transition-all duration-500 ease-smooth group-hover:translate-x-2 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>

          {/* New Dynamic Color Border on Hover */}
          <span className="absolute inset-0 rounded-full border border-black/5 opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
          <span 
            className="absolute inset-0 rounded-full border-2 border-transparent transition-all duration-500 scale-100 group-hover:scale-105 z-40 pointer-events-none"
            style={{ borderColor: `${accentColor}4D` }} // 30% opacity
          />
        </span>

        {/* Outer Multi-Color Glow Effect on Hover */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 scale-125 hover-glow"
          style={{ backgroundColor: `${accentColor}4D` }} // 30% opacity
        />
        <div className="absolute inset-x-5 inset-y-2 rounded-full bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-80 transition-all duration-700 -z-10 scale-110" />
      </Link>
    </motion.div>
  );
};

export default PrimaryCTA;
