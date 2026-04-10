import React, { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../components/SEO";
import PrimaryCTA from "../components/Common/PrimaryCTA";

gsap.registerPlugin(ScrollTrigger);

const WallOfFame = () => {
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    // Smooth scroll setup or other minor layout adjustments if needed
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const collaborators = [
    // New Logos

    {
      id: "n4",
      image:
        "https://res.cloudinary.com/daokrum7i/image/upload/v1770734782/Bangalore_City_Police_Logo_pse9ph.png",
    },

    {
      id: "n6",
      image:
        "https://res.cloudinary.com/daokrum7i/image/upload/v1770734782/Mane_Mane_ge_Police_szqjnh.png",
    },
    // Existing Logos
    {
      id: "e1",
      image:
        "https://res.cloudinary.com/daokrum7i/image/upload/v1767858723/hc_buc_in_cgo6ap.avif",
      link: "https://www.bucindia.com/",
    },
    {
      id: "e2",
      image:
        "https://res.cloudinary.com/daokrum7i/image/upload/v1767858721/hc_ufh_ohpyit.avif",
      link: "https://www.instagram.com/ufhriders/",
    },
    {
      id: "e3",
      image:
        "https://res.cloudinary.com/daokrum7i/image/upload/v1767858720/hc_cit_ben_urpobb.avif",
      link: "https://www.instagram.com/cit.bengaluru/",
    },
    {
      id: "e4",
      image:
        "https://res.cloudinary.com/daokrum7i/image/upload/v1767858720/hc_sag_events_tckhz4.avif",
    },
    {
      id: "n5",
      image:
        "https://res.cloudinary.com/daokrum7i/image/upload/v1770734782/CortexFooter_mjusnb.png",
      link: "https://www.cortexit.in",
    },
    {
      id: "e5",
      image:
        "https://res.cloudinary.com/daokrum7i/image/upload/v1767858719/hc_pps_fmrkex.avif",
    },
    {
      id: "n1",
      image:
        "https://res.cloudinary.com/daokrum7i/image/upload/v1770734780/gopalan_uktg5e.jpg",
    },
    {
      id: "n2",
      image:
        "https://res.cloudinary.com/daokrum7i/image/upload/v1770734781/aims_pvvk8z.jpg",
    },
    {
      id: "n3",
      image:
        "https://res.cloudinary.com/daokrum7i/image/upload/v1770734781/adisunkara_jldkkz.jpg",
    },
  ];

  return (
    <div className="bg-white" ref={containerRef}>
      <SEO
        title={t("wall_of_fame.seo_title")}
        description={t("wall_of_fame.seo_desc")}
      />

      {/* Hero Section */}
      <section className="pt-40 pb-24 text-center px-[5%] bg-[#fcf8f8] overflow-hidden">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
           className="max-w-5xl mx-auto space-y-8"
        >
          <div className="space-y-4">
            <span className="text-emerald-500 text-[10px] uppercase tracking-[0.4em] font-black">
              Collaborators
            </span>
            <h1 
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-[#1a1a1a] leading-[0.9]"
              style={{ fontFamily: '"Syne", sans-serif' }}
            >
              Wall of <br />
              <span className="text-[#10B981] italic">Fame</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl mx-auto lowercase">
            {t("wall_of_fame.hero_subtitle")}
          </p>
        </motion.div>
      </section>

      {/* Hero Banner */}
      <motion.section 
        initial={{ opacity: 0, scale: 1.05 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        className="w-full relative h-[40vh] md:h-[60vh] overflow-hidden"
      >
        <img
          src="https://res.cloudinary.com/daokrum7i/image/upload/v1767858724/hc_wall_of_fame_qb8ckv.avif"
          alt="Wall of Fame Banner"
          className="w-full h-full object-cover block"
        />
        <div className="absolute inset-0 bg-black/5" />
      </motion.section>

      <div className="max-w-none mx-auto px-[5%] py-32 space-y-40">
        {/* Our Journey Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-indigo-500 text-[10px] uppercase tracking-[0.4em] font-black">
                  Our Journey
                </span>
                <h2 
                  className="text-4xl md:text-6xl font-bold text-[#1a1a1a]"
                  style={{ fontFamily: '"Syne", sans-serif' }}
                >
                  Strength in <br />
                  <span className="text-[#4F46E5] italic">Unity</span>
                </h2>
              </div>
              <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed lowercase italic border-l-2 border-indigo-500/20 pl-8">
                {t("wall_of_fame.story_para1")}
              </p>
              <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed lowercase">
                 {t("wall_of_fame.story_para2")}
              </p>
            </div>

            <div className="relative group">
              <div className="bg-[#fcf8f8] p-12 rounded-[40px] border border-black/5 relative overflow-hidden">
                <blockquote className="text-2xl md:text-3xl text-[#1a1a1a] font-light leading-relaxed italic lowercase">
                    {t("wall_of_fame.quote")}
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                   <div className="w-10 h-px bg-indigo-500/30" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Global Vision</span>
                </div>
              </div>
              {/* Decorative Glow */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
            </div>
        </section>

        {/* Collaborators Grid */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
             <span className="text-[#E74C3C] text-[10px] uppercase tracking-[0.4em] font-black">Our Partners</span>
             <h2 className="text-4xl md:text-6xl font-bold text-[#1a1a1a]" style={{ fontFamily: '"Syne", sans-serif' }}>
               Top Level <span className="text-[#E74C3C] italic">Collaborators</span>
             </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 lg:gap-14">
            {collaborators.map((collab, idx) => (
              <motion.div
                key={collab.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: idx * 0.05, duration: 0.8 }
                }}
                viewport={{ once: true }}
                animate={{ 
                  y: [0, -8, 0],
                  transition: { 
                    duration: 4 + (idx % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.2
                  } 
                }}
                className="relative group flex flex-col items-center"
              >
                {/* Premium Frame Design */}
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    rotateX: 5,
                    rotateY: 5,
                    z: 50
                  }}
                  className="relative w-full aspect-square p-px rounded-[32px] overflow-hidden bg-white/40 backdrop-blur-xs border border-white/20 hover:bg-white/60 transition-all duration-700 shadow-xl shadow-black/2 hover:shadow-2xl hover:shadow-black/5"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Subtle Metallic Liquid Gradient Border on Hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer" />

                  {/* Inner Content Area */}
                  <div className="absolute inset-px bg-white rounded-[31px] p-8 md:p-10 flex items-center justify-center overflow-hidden">
                    {collab.link ? (
                      <a
                        href={collab.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={collab.image}
                          alt="Collaborator Logo"
                          className="max-w-full max-h-full object-contain transition-all duration-700 ease-smooth scale-95 group-hover:scale-105"
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <img
                        src={collab.image}
                        alt="Collaborator Logo"
                        className="max-w-full max-h-full object-contain transition-all duration-700 ease-smooth scale-95 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* Card Glow Reveal */}
                  <div className="absolute inset-0 bg-[#BF953F]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Join Subsection */}
        <section className="text-center space-y-12">
            <div className="w-24 h-[2px] bg-black/5 mx-auto" />
            <PrimaryCTA 
              to="/collaborate" 
              accentColor="#10B981"
              className="flex justify-center"
            >
              Collaborate with us
            </PrimaryCTA>
        </section>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }
      `,
        }}
      />
    </div>
  );
};

export default WallOfFame;
