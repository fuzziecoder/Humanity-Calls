import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdAccountBalanceWallet } from "react-icons/md";
import SEO from "../components/SEO";
import Button from "../components/Button";
import { sendEmail } from "../utils/email";
import { uploadPublicImage } from "../utils/publicForms";
import { fetchFormAssets } from "../utils/formAssets";
import { getCurrentLocationLabel } from "../utils/location";
import withFormAuth from "../components/withFormAuth";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaCheckCircle, FaHandHoldingHeart, FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const Donate = ({
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
  const [heroImage, setHeroImage] = useState(
    "https://res.cloudinary.com/daokrum7i/image/upload/f_auto,q_auto,w_900/v1767814232/hc_blood_donation_mfwveo.png",
  );
  const [showThankYou, setShowThankYou] = useState(false);

  useLayoutEffect(() => {
    const isMobile = window.innerWidth < 768;
    const yOffset = isMobile ? 15 : 30;

    const ctx = gsap.context(() => {
      const title = document.querySelector('[data-animation="donate-title"]');
      const form = document.querySelector('[data-animation="donate-form"]');

      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: title,
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

  const [formData, setFormData] = useState(() => {
    const saved = loadPendingFormData();
    return (
      saved || {
        name: "",
        email: user?.email || "",
        phone: "",
        amount: "",
        transactionId: "",
        locationAddress: "",
        donationImageUrl: "",
      }
    );
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  useEffect(() => {
    fetchFormAssets()
      .then((assets) => setHeroImage(assets.donate_page_hero || heroImage))
      .catch(() => null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (formData.locationAddress) return;
    getCurrentLocationLabel()
      .then((label) => setFormData((prev) => ({ ...prev, locationAddress: prev.locationAddress || label })))
      .catch(() => null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = formData.donationImageUrl;

      // Upload image first if a new file is selected
      if (selectedFile) {
        finalImageUrl = await uploadPublicImage(selectedFile);
      }

      const submissionData = {
        ...formData,
        donationImageUrl: finalImageUrl
      };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/donations`, submissionData);
      setShowThankYou(true);
      clearPendingFormData();
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        amount: "",
        transactionId: "",
        locationAddress: "",
        donationImageUrl: "",
      });
      setSelectedFile(null);
      setPreviewUrl("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoLocation = async () => {
    setLocating(true);
    try {
      const label = await getCurrentLocationLabel();
      setFormData((prev) => ({ ...prev, locationAddress: label }));
    } catch (_error) {
      toast.error("Unable to fetch location. Please enter manually.");
    } finally {
      setLocating(false);
    }
  };

  const handleDonationImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="bg-bg min-h-screen py-24" ref={containerRef}>
      <SEO title={t("donate.seo_title")} description={t("donate.seo_desc")} />

      <div className="max-w-none mx-auto px-[5%] grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div data-animation="donate-title" className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
              {t("donate.title")}
            </h1>
            <p className="text-lg text-text-body/80 leading-relaxed max-w-xl">
              {t("donate.description")}
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-border shadow-sm space-y-6">
            <div className="space-y-4 text-center">
              <h4 className="font-bold text-xl text-gray-800">
                {t("donate.scan_pay_text")}
              </h4>
              <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blood rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src={heroImage}
                  alt="Donation QR Code"
                  className="relative rounded-xl border-4 border-white shadow-2xl w-64 h-64 mx-auto object-contain"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider mb-1">
                  {t("donate.upi_id_label")}
                </p>
                <p className="text-2xl font-bold text-primary select-all">
                  {t("donate.upi_id_value")}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
              <MdAccountBalanceWallet className="text-primary" />
              {t("donate.why_donate_title")}
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {t("donate.why_donate_list", { returnObjects: true }).map(
                (item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="text-primary font-bold">•</span>
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div
          className="bg-white p-8 md:p-12 rounded-3xl border border-border shadow-2xl sticky top-24"
          data-animation="donate-form"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              {t("donate.form_title")}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Please fill the details after making the payment
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t("donate.full_name")}
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("donate.placeholders.name")}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("donate.email_address")}
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("donate.placeholders.email")}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isFieldDisabled("email")}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("donate.phone_number")}
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  minLength={10}
                  maxLength={10}
                  placeholder={t("donate.placeholders.phone")}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Current location
                </label>
                <button
                  type="button"
                  onClick={handleAutoLocation}
                  className="text-xs px-3 py-1.5 border border-primary text-primary rounded-lg font-bold"
                >
                  {locating ? "Locating..." : "Use my location"}
                </button>
              </div>
              <textarea
                required
                rows={2}
                name="locationAddress"
                value={formData.locationAddress}
                onChange={handleChange}
                placeholder="Your current area/address"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("donate.donation_amount")}
                </label>
                <input
                  required
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder={t("donate.placeholders.amount")}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("donate.transaction_id")}
                </label>
                <input
                  required
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  placeholder={t("donate.placeholders.transaction_id")}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Payment screenshot (optional)
              </label>
              
              {!previewUrl ? (
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDonationImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full py-6 px-4 border-2 border-dashed border-gray-200 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group-hover:border-primary group-hover:bg-primary/5">
                    <div className="w-12 h-12 bg-white text-primary shadow-sm rounded-xl flex items-center justify-center">
                      <FaCloudUploadAlt size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-700">Click to upload screenshot</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-border group shadow-sm">
                  <img
                    src={previewUrl}
                    alt="Payment proof"
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
            {renderSubmitButton(
              <Button
                type="submit"
                isLoading={loading}
                className="w-full py-4 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 mt-4"
              >
                Submit Donation Details
              </Button>,
              formData,
            )}
            <p className="text-center text-xs text-gray-400 mt-4">
              Your data is secured with end-to-end encryption
            </p>
          </form>
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
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blood to-primary" />
              
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <FaCheckCircle size={48} className="animate-bounce" />
              </div>

              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                Thank You for Your Donation! ❤️
              </h2>
              
              <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">
                Your generosity makes a real difference. We have received your details and will update you shortly via email.
              </p>

              <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <FaHandHoldingHeart size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-primary uppercase tracking-widest leading-none mb-1">Impact Status</p>
                  <p className="text-sm font-bold text-slate-700">Verification in progress...</p>
                </div>
              </div>

              <button
                onClick={() => setShowThankYou(false)}
                className="w-full py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Continue Browsing
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default withFormAuth(Donate);
