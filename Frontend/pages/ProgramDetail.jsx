import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { FaChevronLeft, FaSortAmountDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import SEO from "../components/SEO";
import { PROGRAMS } from "../constants";
import axios from "axios";

const ProgramDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  const program = PROGRAMS.find((p) => p.id === id);
  const progIdx = PROGRAMS.findIndex((p) => p.id === id);

  const accentColors = [
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#8B5CF6", // Violet
    "#EF4444", // Rose
    "#0EA5E9", // Sky
    "#6366F1", // Indigo
  ];
  const accent = progIdx !== -1 ? accentColors[progIdx % accentColors.length] : "#10B981";

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/gallery?projectId=${id}`,
        );
        setImages(response.data);
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (program) {
      fetchGallery();
    }
  }, [id, program]);

  if (!program) {
    return <Navigate to="/404" />;
  }

  const title = t(`about.programs.${id}.title`);
  const desc = t(`about.programs.${id}.desc`);

  // Split title for dual-color effect
  const words = title.split(" ");
  const firstPart = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const secondPart = words.slice(Math.ceil(words.length / 2)).join(" ");

  const sortedImages = [...images].sort((a, b) => {
    const dateA = new Date(a.eventDate || a.createdAt);
    const dateB = new Date(b.eventDate || b.createdAt);
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animate-fade-in",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [id, i18n.language]);

  return (
    <div className="bg-[#fcf8f8] min-h-screen pt-20 pb-24" ref={containerRef} style={{ fontFamily: '"Poppins", sans-serif' }}>
      <SEO title={`${title} | Humanity Calls`} description={desc} />

      <div className="max-w-none mx-auto px-[5%]">
        {/* Navigation Breadcrumb */}
        <div className="max-w-4xl mx-auto mb-16 animate-fade-in">
          <Link 
            to="/#programs" 
            className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-black/30 hover:text-black transition-all group"
          >
            <FaChevronLeft className="text-[9px] group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </div>

        {/* Text Content */}
        <div className="max-w-4xl mx-auto">
          <header className="mb-16 animate-fade-in">
            <div className="flex items-center gap-4 mb-5">
              <span className="w-12 h-[2px]" style={{ backgroundColor: accent }} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: accent }}>
                Our Initiative
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-black tracking-tightest leading-[1.1]" style={{ fontFamily: '"Syne", sans-serif' }}>
              <span className="text-black">{firstPart}</span>
              <br />
              <span style={{ color: accent }}>{secondPart}</span>
            </h1>
          </header>

          <section className="animate-fade-in mb-24">
            <div className="max-w-none">
              <p className="text-xl md:text-2xl font-medium text-black leading-relaxed mb-10">
                {desc}
              </p>
              <div className="space-y-8 text-lg text-black/60 leading-relaxed font-light">
                <p>
                  <Trans
                    i18nKey="program_detail.initiative_cornerstone"
                    values={{ title }}
                    components={{ strong: <strong className="font-bold text-black" /> }}
                  />
                </p>
                <p>
                  {t("program_detail.initiative_expansion")}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Gallery Content */}
        <div className="max-w-none mx-auto mt-32 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 px-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[2px]" style={{ backgroundColor: accent }} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: accent }}>Visual Impact</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-black tracking-tightest leading-none uppercase" style={{ fontFamily: '"Syne", sans-serif' }}>
               {t("common.word_gallery")}.
              </h2>
            </div>

            <div className="flex items-center gap-4 bg-white p-2 pl-6 rounded-full border border-black/5 shadow-sm">
              <FaSortAmountDown className="text-black/20 text-sm" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none px-4 py-2 outline-none cursor-pointer font-bold text-[11px] uppercase tracking-widest text-black appearance-none pr-8"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="px-2">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="aspect-video bg-black/5 animate-pulse rounded-[2.5rem]"
                  ></div>
                ))}
              </div>
            ) : sortedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {sortedImages.map((img) => (
                  <div
                    key={img._id}
                    className="group relative aspect-video rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 cursor-zoom-in border border-black/5"
                    onClick={() => setSelectedImage(img.imageUrl)}
                  >
                    <img
                      src={img.imageUrl}
                      alt="Gallery"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      loading="lazy"
                    />
                    {img.eventDate && (
                      <div className="absolute bottom-6 left-6 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <span 
                          className="text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-lg border border-white/10"
                          style={{ backgroundColor: accent }}
                        >
                          {new Date(img.eventDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full min-h-[400px] rounded-[3rem] border-2 border-dashed border-black/5 flex items-center justify-center bg-white/50">
                <div className="text-center max-w-sm">
                  <p className="text-2xl font-black text-black/10 mb-4 uppercase tracking-tighter italic">
                    {t("common.gallery_preparing_title")}
                  </p>
                  <p className="text-xs font-bold text-black/20 uppercase tracking-widest leading-loose">
                    {t("common.gallery_preparing_desc")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-10 right-10 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all hover:rotate-90">
              <span className="text-2xl tracking-tighter">×</span>
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Fullscreen"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgramDetail;
