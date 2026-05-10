import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

const ActionButton = ({ to, label }) => (
  <Link
    to={to}
    className="inline-flex flex-1 items-center justify-center px-2 sm:px-4 py-3 rounded-full border border-white/80 text-white text-[7.5px] min-[375px]:text-[8.5px] sm:text-[11px] font-black uppercase tracking-tight min-[375px]:tracking-[0.1em] sm:tracking-[0.2em] bg-black/35 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.35)] hover:bg-white hover:text-[#1A1A1A] hover:border-white hover:shadow-[0_12px_30px_rgba(255,255,255,0.4)] transition-all duration-300 whitespace-nowrap"
  >
    {label}
  </Link>
);

const Card = ({ title, description, color, image, index, total, actions = [] }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  // Calculate top offset for stacking effect (e.g. 10%, 15%, 20%)
  const topOffset = 80 + (index * 40); // 80px base + 40px per card

  // Scale and opacity based on scroll
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <div
      ref={containerRef}
      className="sticky h-screen flex items-center justify-center"
      style={{ zIndex: index + 1, top: `${topOffset}px` }}
    >
      <motion.div
        style={{ scale }}
        className={`relative w-[92%] md:w-[85%] max-w-[1200px] h-[75vh] md:h-[70vh] rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center border border-white/10`}
      >
        {/* Background Gradient */}
        <div 
          className="absolute inset-0 z-0 transition-transform duration-700" 
          style={{ background: color }}
        />

        {/* Card Image Wrapper */}
        <div className="relative z-10 w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
           <img 
             src={image} 
             alt={title} 
             className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
           />
           <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        </div>
        
        {/* Decorative Glass Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-black/10 rounded-full blur-3xl" />

        {/* Content Section */}
        <div className={`relative z-10 w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center p-6 sm:p-8 md:p-16 text-left space-y-4 sm:space-y-6 md:space-y-8 ${index % 2 === 1 ? 'md:items-start' : 'md:items-start'}`}>
          <motion.h2
            initial={{ opacity: 0, x: index % 2 === 1 ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[clamp(1.5rem,3.5vw,3rem)] leading-[0.95] tracking-tighter"
            style={{ 
              fontFamily: '"Syne", sans-serif', 
              fontWeight: 800, 
              textTransform: "uppercase",
            }}
          >
            {title.split(' ').map((word, i) => (
              <span key={i} className={i % 2 === 0 ? "text-white" : "text-white/60"}>
                {word}{' '}
              </span>
            ))}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[clamp(0.8rem,1.2vw,1.1rem)] text-white/90 max-w-lg font-light leading-relaxed line-clamp-4 md:line-clamp-none"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-2 w-full max-w-lg"
          >
            <div className="flex items-center gap-2 sm:gap-3 w-full">
              {actions.map((action) => (
                <ActionButton key={`${action.to}-${action.label}`} to={action.to} label={action.label} />
              ))}
            </div>
            <div className="mt-3 h-px w-full bg-linear-to-r from-transparent via-white/50 to-transparent" />
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
};

const PinnedStackingCards = () => {
  const { t } = useTranslation();

  const cards = [
    {
      title: t("home.help_poor_needy_title"),
      description: t("home.poor_needy_paragraph"),
      color: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
      image: "https://res.cloudinary.com/daokrum7i/image/upload/f_auto,q_auto,w_800,c_limit/v1767814233/humanity_calls_poor_needy_oef47s.avif",
      actions: [
        { to: "/poor-needy", label: "Request for Help" },
        { to: "/poor-needy", label: "Help Now" },
      ],
    },
    {
      title: t("home.animal_rescue_title"),
      description: t("home.animal_rescue_paragraph"),
      color: "linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)",
      image: "https://res.cloudinary.com/daokrum7i/image/upload/f_auto,q_auto,w_800,c_limit/v1767814232/humanity_calls_animal_resque_dxz9jb.avif",
      actions: [
        { to: "/animal-rescue", label: "Ask for Rescue" },
        { to: "/animal-rescue", label: "Adopt Tdy" },
      ],
    },
    {
      title: t("home.donate_blood_save_lives"),
      description: t("home.blood_donation_paragraph"),
      color: "linear-gradient(135deg, #E74C3C 0%, #B22222 100%)",
      image: "https://res.cloudinary.com/daokrum7i/image/upload/f_auto,q_auto,w_800/v1767814232/hc_blood_donation_mfwveo.png",
      actions: [
        { to: "/blood-donation", label: "Donate Now" },
        { to: "/request-donors", label: "Find Donors" },
      ],
    },
  ];

  return (
    <div className="relative py-24 bg-[#fcf8f8]">
      <div className="container mx-auto px-6 mb-16 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-primary text-xs uppercase tracking-[0.4em] font-bold"
        >
          Our Core Missions
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl text-[#1a1a1a] font-bold mt-4"
          style={{ fontFamily: '"Syne", sans-serif' }}
        >
          Making a <span className="text-[#4F46E5] italic border-b-4 border-indigo-500/20">Real</span> Impact
        </motion.h2>
      </div>

      {cards.map((card, index) => (
        <Card key={index} {...card} index={index} total={cards.length} />
      ))}
    </div>
  );
};

export default PinnedStackingCards;
