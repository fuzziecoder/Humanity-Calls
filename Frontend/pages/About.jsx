import React, { useLayoutEffect, useRef } from "react";
import { useTranslation, Trans } from "react-i18next";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../components/SEO";
import { IMAGE_ALTS } from "../constants";
import PrimaryCTA from "../components/Common/PrimaryCTA";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    // Smooth scroll setup or other minor layout adjustments if needed
    window.scrollTo(0, 0);
  }, [i18n.language]);

  return (
    <div className="bg-white overflow-hidden" ref={containerRef}>
      <SEO
        title={`${t("about.title")} | Humanity Calls`}
        description={t("about.programs_para")}
      />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-32 pb-20 px-[5%] bg-[#fcf8f8]">
        <div className="max-w-none mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="space-y-4"
              >
                <span className="text-primary text-[10px] uppercase tracking-[0.4em] font-black">
                  Our Story
                </span>
                <h1
                  className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#1a1a1a] leading-[0.95]"
                  style={{ fontFamily: '"Syne", sans-serif' }}
                >
                  Humanity <br />
                  <span className="text-[#E74C3C] italic">Calls</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                className="text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-xl lowercase"
              >
                {t("about.story_para")}
              </motion.p>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-fit"
              >
                <PrimaryCTA to="/volunteer" delay={0.2} accentColor="#E74C3C">
                  Join Our Mission
                </PrimaryCTA>
              </motion.div>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                className="relative z-10"
              >
                <img
                  src="https://res.cloudinary.com/daokrum7i/image/upload/v1767814233/humanity_calls_mission_xdaf3d.avif"
                  alt={IMAGE_ALTS.about_hero || "About Humanity Calls"}
                  className="rounded-[40px] w-full aspect-4/5 object-cover shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]"
                />
              </motion.div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/5 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 bg-white px-[5%]" id="mission">
        <div className="max-w-none mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1 relative">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              >
                <img
                  src="https://res.cloudinary.com/daokrum7i/image/upload/v1767814233/humanity_calls_vision_i942bq.png"
                  alt={IMAGE_ALTS.mission}
                  className="rounded-[40px] w-full aspect-square object-cover shadow-2xl"
                />
              </motion.div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <span className="text-emerald-500 text-[10px] uppercase tracking-[0.4em] font-black">
                  The Purpose
                </span>
                <h2 
                  className="text-4xl md:text-6xl font-bold text-[#1a1a1a]"
                  style={{ fontFamily: '"Syne", sans-serif' }}
                >
                  Our <span className="text-[#10B981] italic">Mission</span>
                </h2>
              </div>
              <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed lowercase">
                {t("about.mission_para")}
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: '"Syne", sans-serif' }}>1000+</h4>
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Donors Enrolled</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold text-[#1a1a1a]" style={{ fontFamily: '"Syne", sans-serif' }}>50+</h4>
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Years Combined Exp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-32 bg-[#fcf8f8] px-[5%]" id="vision">
        <div className="max-w-none mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-indigo-500 text-[10px] uppercase tracking-[0.4em] font-black">
                  The Future
                </span>
                <h2 
                  className="text-4xl md:text-6xl font-bold text-[#1a1a1a]"
                  style={{ fontFamily: '"Syne", sans-serif' }}
                >
                  Our <span className="text-[#4F46E5] italic">Vision</span>
                </h2>
              </div>
              <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed lowercase">
                {t("about.vision_para")}
              </p>
              
              <ul className="space-y-4 pt-4">
                {[
                  "Expanding Emergency Blood Donor Support",
                  "Comprehensive Animal Rescue Operations",
                  "Empowering the Poor & Needy Every Day"
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 text-gray-500 font-light"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              >
                <img
                  src="https://res.cloudinary.com/daokrum7i/image/upload/v1767814233/humanity_how_can_i_help_xezom5.avif"
                  alt={IMAGE_ALTS.vision}
                  className="rounded-[40px] w-full aspect-square object-cover shadow-2xl"
                />
              </motion.div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Impact / Legacy Section */}
      <section className="py-40 bg-white px-[5%] text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="max-w-4xl mx-auto space-y-12"
        >
          <div className="space-y-4">
            <span className="text-red-500 text-[10px] uppercase tracking-[0.4em] font-black">
              Legacy of Hope
            </span>
            <h2 
              className="text-4xl md:text-7xl font-bold text-[#1a1a1a]"
              style={{ fontFamily: '"Syne", sans-serif' }}
            >
              Voices of <span className="text-[#E74C3C] italic">Resilience</span>
            </h2>
          </div>

          <div className="relative pt-12">
            {/* Custom Styled Quote Card */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-red-500/5 rounded-full flex items-center justify-center -z-10">
              <span className="text-6xl text-red-500/20 font-serif leading-none">“</span>
            </div>
            
            <div className="bg-[#fcf8f8] p-12 md:p-20 rounded-[40px] border border-black/5 relative shadow-sm">
              <p className="text-lg md:text-2xl text-[#1a1a1a] font-light leading-relaxed lowercase italic">
                {t("about.covid_para")}
              </p>
              
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                </div>
                <p className="text-xs uppercase tracking-[0.4em] font-black text-gray-400">
                  from 2020
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="pb-32 pt-10 bg-white">
        <div className="max-w-none mx-auto px-[5%] flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <PrimaryCTA to="/donate" delay={0.1} accentColor="#4F46E5">
              Support Our Impact
            </PrimaryCTA>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
