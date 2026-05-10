import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import gsap from "gsap";
import Button from "./Button";
import cortexLogo from "../assets/cortexlogo.png";
import hclogo from "../assets/humanitycallslogo.avif";
import { SOCIAL_LINKS, WHATSAPP_NUMBER } from "../constants";
import { animateFooterElements } from "../utils/animations";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      animateFooterElements();
    }, footerRef);
    return () => ctx.revert();
  }, [i18n.language]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#080808] text-white pt-24 pb-12 overflow-hidden border-t border-white/5" ref={footerRef}>
      <div className="max-w-none mx-auto px-[5%]">
        {/* Top Logo Section */}
        <div className="mb-20">
          <Link to="/" className="flex items-center space-x-3 outline-none w-fit">
            <img
              src={hclogo}
              width="45"
              height="45"
              className="w-[45px] h-[45px] object-contain"
              alt="Humanity Calls logo"
            />
            <div className="flex flex-col">
              <span
                className="text-xl font-black text-blood leading-none"
                style={{ fontFamily: '"Poppins", sans-serif' }}
              >
                Humanity Calls
              </span>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-24">
          
          {/* Column 1: Company */}
          <div className="space-y-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#6366F1]">
              Organization
            </h3>
            <ul className="flex flex-col gap-5">
              {[
                { to: "/about", label: "About Us" },
                { to: "/gallery", label: "Gallery" },
                { to: "/volunteer", label: "Volunteer" },
                { to: "/collaborate", label: "Collaborate" },
                { to: "/wall-of-fame", label: "Wall of Fame" },
              ].map((link) => (
                <FooterLink key={link.to} to={link.to} hoverColor="#6366F1">{link.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Column 2: Missions */}
          <div className="space-y-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#10B981]">
              Our Missions
            </h3>
            <ul className="flex flex-col gap-5">
              {[
                { to: "/request-donors", label: "Blood Donation" },
                { to: "/animal-rescue", label: "Animal Rescue" },
                { to: "/poor-needy", label: "Poor & Needy" },
                { to: "/donations-made", label: "Impact Archive" },
              ].map((link) => (
                <FooterLink key={link.to} to={link.to} hoverColor="#10B981">{link.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Column 3: Resource */}
          <div className="space-y-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#F59E0B]">
              Resources
            </h3>
            <ul className="flex flex-col gap-5">
              {[
                { to: "/donate", label: "Donate Now" },
                { to: "/blood-donation", label: "Blood Donation Form" },
                { to: "/request-donors", label: "Find Donors" },
                { to: "/contact", label: "Get In Touch" },
                { to: "/faq", label: "Support FAQ" },
              ].map((link) => (
                <FooterLink key={link.to} to={link.to} hoverColor="#F59E0B">{link.label}</FooterLink>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter/Social */}
          <div className="space-y-12">
            <div className="space-y-8">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#EF4444]">
                Contact Info
              </h3>
              <div className="space-y-5">
                <a href="mailto:humanitycallsnotify@gmail.com" className="block text-xl md:text-2xl font-bold text-white hover:text-[#EF4444] transition-colors duration-500" style={{ fontFamily: '"Syne", sans-serif' }}>
                  Get in touch
                </a>
                <p className="text-[15px] text-white/50 font-light leading-relaxed max-w-[240px]" style={{ fontFamily: '"Poppins", sans-serif' }}>
                  Join our community of donors and make a difference today.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 flex-nowrap overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-hide">
              {SOCIAL_LINKS.map((social) => {
                const platformColors = {
                  Facebook: "#1877F2",
                  Instagram: "#E4405F",
                  X: "#000000",
                  WhatsApp: "#25D366",
                  Telegram: "#0088CC",
                  Youtube: "#FF0000"
                };
                const color = platformColors[social.name] || "#4F46E5";

                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover="hover"
                    initial="initial"
                    className="group/social relative w-12 h-12 shrink-0 rounded-full border border-white/10 flex items-center justify-center overflow-hidden transition-colors duration-500"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {/* Unique platform-specific background fill */}
                    <motion.div 
                      variants={{
                        initial: { y: "100%" },
                        hover: { y: 0 }
                      }}
                      transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                      className="absolute inset-0 z-0"
                      style={{ backgroundColor: color }}
                    />
                    
                    {/* Icon container with magnetic lift */}
                    <motion.div
                      variants={{
                        initial: { y: 0, color: "rgba(255,255,255,0.3)" },
                        hover: { y: -2, color: "#fff" }
                      }}
                      className="relative z-10"
                    >
                      <social.icon className="w-5 h-5 transition-transform duration-500 group-hover/social:scale-110" />
                    </motion.div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/30">
          {/* Left: Designer Credit */}
          <a href="https://www.cortexit.in" target="_blank" className="hover:scale-[1.02] transition-transform order-3 md:order-1">
            <div className="flex flex-col items-center md:items-start gap-1">
              <p className="text-white text-[10px] font-medium tracking-widest opacity-60">DESIGNED AND DEVELOPED BY</p>
              <div className="flex items-center gap-3">
                <img className="h-8" src={cortexLogo} alt="Cortex" />
                <p className="text-white text-base font-black tracking-tighter">CORTEX™</p>
              </div>
            </div>
          </a>

          {/* Center: Copyright */}
          <div className="text-center order-2">
            © 2026 Humanity Calls Trust®. All rights reserved.
          </div>

          {/* Right: Legal Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-8 order-1 md:order-3">
            {[
              { to: "/terms", label: "Terms" },
              { to: "/privacy", label: "Privacy" },
              { to: "/disclaimer", label: "Disclaimer" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-white transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children, hoverColor }) => (
  <motion.li whileHover={{ x: 8 }} transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}>
    <Link 
      to={to} 
      className="group flex items-center gap-3 text-[15px] font-medium text-white/40 transition-all duration-500"
      style={{ 
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <span className="w-0 h-[1.5px] group-hover:w-4 transition-all duration-500" style={{ backgroundColor: hoverColor }} />
      <span className="group-hover:text-white" style={{ transition: 'color 0.4s ease' }}>
        {children}
      </span>
    </Link>
  </motion.li>
);

export default Footer;
