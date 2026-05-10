import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../components/SEO";
import Button from "../components/Button";
import { IMAGE_ALTS } from "../constants";
import { sendEmail } from "../utils/email";
import withFormAuth from "../components/withFormAuth";
import axios from "axios";
import { toast } from "react-toastify";
import { getCurrentLocationLabel } from "../utils/location";
import { uploadPublicImage } from "../utils/publicForms";
import { FaPaperclip, FaCloudUploadAlt, FaTrashAlt, FaHeart, FaCheckCircle, FaPaw } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getAuthToken } from "../utils/authToken.js";

gsap.registerPlugin(ScrollTrigger);

const AnimalRescue = ({
  user,
  isFieldDisabled,
  renderSubmitButton,
  loadPendingFormData,
  clearPendingFormData,
}) => {
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [activeForm, setActiveForm] = useState("rescue"); // rescue | adopt

  useLayoutEffect(() => {
    const isMobile = window.innerWidth < 768;
    const yOffset = isMobile ? 15 : 30;

    const ctx = gsap.context(() => {
      const image = document.querySelector('[data-animation="ar-image"]');
      const title = document.querySelector('[data-animation="ar-title"]');
      const text = document.querySelector('[data-animation="ar-text"]');
      const form = document.querySelector('[data-animation="ar-form"]');

      if (image) {
        gsap.fromTo(
          image,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: image,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: title,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      if (text) {
        gsap.fromTo(
          text,
          { opacity: 0, y: isMobile ? 10 : 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: text,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      if (form) {
        gsap.fromTo(
          form,
          { opacity: 0, y: isMobile ? 20 : 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: form,
              start: "top 80%",
              once: true,
            },
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [i18n.language]);

  const [rescueData, setRescueData] = useState(() => {
    const saved = loadPendingFormData();
    return (
      saved || {
        firstName: user?.name || "",
        phone: "",
        email: user?.email || "",
        address: "",
        severity: "",
        animalImageUrl: "",
        message: "",
      }
    );
  });

  const [adoptData, setAdoptData] = useState(() => ({
    fullName: user?.name || "",
    phone: "",
    email: user?.email || "",
    city: "",
    homeType: "",
    experience: "",
    animalPreference: "",
    message: "",
  }));

  useEffect(() => {
    if (user) {
      setRescueData((prev) => ({ ...prev, firstName: user.name, email: user.email }));
      setAdoptData((prev) => ({ ...prev, fullName: user.name, email: user.email }));
    }
  }, [user]);

  const handleSubmitRescue = async (e) => {
    e.preventDefault();
    if (!selectedFile && !rescueData.animalImageUrl) {
      toast.error("Please upload an animal image");
      return;
    }
    setLoading(true);

    try {
      let finalImageUrl = rescueData.animalImageUrl;
      if (selectedFile) {
        finalImageUrl = await uploadPublicImage(selectedFile);
      }

      const submissionData = {
        ...rescueData,
        animalImageUrl: finalImageUrl
      };

      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post(
        `${import.meta.env.VITE_API_URL}/form-submissions/animal_rescue_request`,
        submissionData,
        { headers, withCredentials: true },
      );

      await sendEmail(
        "Animal Rescue Request",
        submissionData,
        `New Animal Rescue Request from ${submissionData.firstName}`,
      );

      clearPendingFormData();
      setRescueData({
        firstName: user?.name || "",
        phone: "",
        email: user?.email || "",
        address: "",
        severity: "",
        animalImageUrl: "",
        message: "",
      });
      setSelectedFile(null);
      setPreviewUrl("");
      setShowThankYou(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit rescue request");
    } finally {
      setLoading(false);
    }
  };

  const handleRescueChange = (e) => {
    setRescueData({ ...rescueData, [e.target.name]: e.target.value });
  };

  const handleAdoptChange = (e) => {
    setAdoptData({ ...adoptData, [e.target.name]: e.target.value });
  };

  const handleSubmitAdopt = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post(
        `${import.meta.env.VITE_API_URL}/form-submissions/animal_adopt_now`,
        adoptData,
        { headers, withCredentials: true },
      );

      await sendEmail(
        "Adopt Now Request",
        adoptData,
        `New Adoption Request from ${adoptData.fullName}`,
      );

      setAdoptData({
        fullName: user?.name || "",
        phone: "",
        email: user?.email || "",
        city: "",
        homeType: "",
        experience: "",
        animalPreference: "",
        message: "",
      });
      setShowThankYou(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit adoption request");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 border border-border bg-white rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed";

  const handleAutoLocation = async () => {
    setLocating(true);
    try {
      const label = await getCurrentLocationLabel();
      setRescueData((prev) => ({ ...prev, address: label }));
    } catch (_error) {
      toast.error("Unable to fetch location. Please enter manually.");
    } finally {
      setLocating(false);
    }
  };

  const handleRescueImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="bg-bg pb-24" ref={containerRef}>
      <SEO
        title={t("animal_rescue.seo_title")}
        description={t("animal_rescue.seo_desc")}
      />

      <section className="py-24 max-w-none mx-auto px-[5%] bg-white">
        <div className="flex flex-col items-center space-y-8">
          <img
            src="https://res.cloudinary.com/daokrum7i/image/upload/v1767814232/humanity_calls_animal_resque_dxz9jb.avif"
            alt={IMAGE_ALTS.animalRescue}
            className="rounded-2xl"
            data-animation="ar-image"
          />
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-primary" data-animation="ar-title">{t("animal_rescue.title")}</h1>
            <p className="text-lg text-text-body leading-relaxed" data-animation="ar-text">
              {t("animal_rescue.main_text")}
            </p>
            <div className="p-8 bg-bg rounded-2xl border-l-8 border-primary">
              <h2 className="text-2xl font-bold mb-2 text-primary">{t("animal_rescue.voice_title")}</h2>
              <p className="text-text-body/80">
                {t("animal_rescue.voice_desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-none mx-auto px-[5%] mt-12">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-border shadow-xl" data-animation="ar-form">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h3 className="text-2xl font-bold text-primary">
              Animal Rescue Forms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveForm("rescue")}
                className={`px-4 py-3 rounded-2xl font-bold transition-all text-sm border ${
                  activeForm === "rescue"
                    ? "bg-primary text-white shadow-md border-primary"
                    : "text-text-body/70 hover:text-primary bg-white border-border"
                }`}
              >
                <span className="block text-[10px] uppercase tracking-[0.25em] opacity-80">Seek Help</span>
                <span>Ask for Rescue</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveForm("adopt")}
                className={`px-4 py-3 rounded-2xl font-bold transition-all text-sm border ${
                  activeForm === "adopt"
                    ? "bg-primary text-white shadow-md border-primary"
                    : "text-text-body/70 hover:text-primary bg-white border-border"
                }`}
              >
                <span className="block text-[10px] uppercase tracking-[0.25em] opacity-80">Offer Support</span>
                <span>Adopt Now</span>
              </button>
            </div>
          </div>

          {activeForm === "rescue" ? (
            <form onSubmit={handleSubmitRescue} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-body uppercase">
                    Your Name *
                  </label>
                  <input
                    required
                    name="firstName"
                    value={rescueData.firstName}
                    onChange={handleRescueChange}
                    className={inputClasses}
                    disabled={isFieldDisabled("firstName")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-body uppercase">
                    {t("form.phone")} *
                  </label>
                  <input
                    required
                    name="phone"
                    value={rescueData.phone}
                    onChange={handleRescueChange}
                    minLength={10}
                    maxLength={10}
                    className={inputClasses}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-body uppercase">
                  {t("form.email")} *
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={rescueData.email}
                  onChange={handleRescueChange}
                  className={inputClasses}
                  disabled={isFieldDisabled("email")}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-bold text-text-body uppercase">
                    Location / Address *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoLocation}
                    className="text-[10px] px-3 py-1 rounded-lg border border-primary text-primary font-bold"
                  >
                    {locating ? "Locating..." : "Use my location"}
                  </button>
                </div>
                <input
                  required
                  name="address"
                  value={rescueData.address}
                  onChange={handleRescueChange}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-body uppercase">
                  Severity *
                </label>
                <select
                  required
                  name="severity"
                  value={rescueData.severity}
                  onChange={handleRescueChange}
                  className={inputClasses}
                >
                  <option value="">Select severity</option>
                  <option value="Low - Animal is safe for now">Low - Animal is safe for now</option>
                  <option value="Medium - Animal needs help soon">Medium - Animal needs help soon</option>
                  <option value="High - Emergency rescue needed">High - Emergency rescue needed</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-text-body uppercase">
                  Upload Animal Image *
                </label>
                {!previewUrl ? (
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleRescueImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full py-8 px-4 border-2 border-dashed border-gray-200 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group-hover:border-primary group-hover:bg-primary/5">
                      <div className="w-12 h-12 bg-white text-primary shadow-sm rounded-xl flex items-center justify-center">
                        <FaCloudUploadAlt size={24} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-700">Click to upload animal photo</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-border group shadow-sm">
                    <img
                      src={previewUrl}
                      alt="Rescue preview"
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl("");
                        }}
                        className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all transform translate-y-2 group-hover:translate-y-0"
                      >
                        <FaTrashAlt size={16} />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                      SELECTED
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-body uppercase">
                  Situation Details *
                </label>
                <textarea
                  required
                  name="message"
                  value={rescueData.message}
                  onChange={handleRescueChange}
                  rows={4}
                  className={inputClasses}
                ></textarea>
              </div>
              {renderSubmitButton(
                <Button type="submit" variant="primary" isLoading={loading} className="w-full py-4">
                  Submit Rescue Request
                </Button>,
                rescueData,
              )}
            </form>
          ) : (
            <form onSubmit={handleSubmitAdopt} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-body uppercase">
                    Full Name *
                  </label>
                  <input
                    required
                    name="fullName"
                    value={adoptData.fullName}
                    onChange={handleAdoptChange}
                    className={inputClasses}
                    disabled={isFieldDisabled("fullName")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-body uppercase">
                    {t("form.phone")} *
                  </label>
                  <input
                    required
                    name="phone"
                    value={adoptData.phone}
                    onChange={handleAdoptChange}
                    minLength={10}
                    maxLength={10}
                    className={inputClasses}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-body uppercase">
                  {t("form.email")} *
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={adoptData.email}
                  onChange={handleAdoptChange}
                  className={inputClasses}
                  disabled={isFieldDisabled("email")}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-body uppercase">City *</label>
                  <input
                    required
                    name="city"
                    value={adoptData.city}
                    onChange={handleAdoptChange}
                    placeholder="Your city"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-body uppercase">Home Type *</label>
                  <select
                    required
                    name="homeType"
                    value={adoptData.homeType}
                    onChange={handleAdoptChange}
                    className={inputClasses}
                  >
                    <option value="">Select</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Farm / Outdoor Space">Farm / Outdoor Space</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-body uppercase">Experience *</label>
                  <select
                    required
                    name="experience"
                    value={adoptData.experience}
                    onChange={handleAdoptChange}
                    className={inputClasses}
                  >
                    <option value="">Select</option>
                    <option value="First time">First time</option>
                    <option value="Have adopted before">Have adopted before</option>
                    <option value="Currently have pets">Currently have pets</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-body uppercase">Animal Preference *</label>
                  <select
                    required
                    name="animalPreference"
                    value={adoptData.animalPreference}
                    onChange={handleAdoptChange}
                    className={inputClasses}
                  >
                    <option value="">Select</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Any">Any</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-body uppercase">Message *</label>
                <textarea
                  required
                  name="message"
                  value={adoptData.message}
                  onChange={handleAdoptChange}
                  rows={4}
                  placeholder="Why do you want to adopt? Any details we should know?"
                  className={inputClasses}
                />
              </div>
              {renderSubmitButton(
                <Button type="submit" variant="primary" isLoading={loading} className="w-full py-4">
                  Submit Adoption Request
                </Button>,
                adoptData,
              )}
            </form>
          )}
        </div>
      </div>



      {/* Thank You Popup */}
      <AnimatePresence>
        {showThankYou && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-orange-400 to-primary" />
              
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <FaCheckCircle size={48} className="animate-bounce" />
              </div>

              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                Thank You for Your Voice! 🐾
              </h2>
              
              <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">
                Every request brings us closer to a safer world for animals. We have received your details and will update you shortly.
              </p>

              <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <FaPaw size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-primary uppercase tracking-widest leading-none mb-1">Impact Status</p>
                  <p className="text-sm font-bold text-slate-700">Rescue team notified...</p>
                </div>
              </div>

              <button
                onClick={() => setShowThankYou(false)}
                className="w-full py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Return to Site
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default withFormAuth(AnimalRescue);
