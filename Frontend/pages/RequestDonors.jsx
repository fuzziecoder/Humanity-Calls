import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SEO from "../components/SEO";
import Button from "../components/Button";
import { IMAGE_ALTS } from "../constants";
import { sendEmail } from "../utils/email";
import { uploadPublicImage } from "../utils/publicForms";
import { fetchFormAssets } from "../utils/formAssets";
import { getCurrentLocationLabel } from "../utils/location";
import withFormAuth from "../components/withFormAuth";
import { toast } from "react-toastify";
import { FaPaperclip, FaCloudUploadAlt, FaTrashAlt, FaHeart, FaCheckCircle, FaTint } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const RequestDonors = ({
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
  const [heroImage, setHeroImage] = useState(
    "https://res.cloudinary.com/daokrum7i/image/upload/v1767814234/request_for_donors_digyme.avif",
  );

  useLayoutEffect(() => {
    const isMobile = window.innerWidth < 768;
    const yOffset = isMobile ? 15 : 30;

    const ctx = gsap.context(() => {
      const title = document.querySelector('[data-animation="req-title"]');
      const form = document.querySelector('[data-animation="req-form"]');

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
        verifiedPersonName: user?.name || "",
        phone: "",
        email: user?.email || "",
        patientName: "",
        bloodGroup: "",
        bloodRequestType: "",
        hospitalAddressWithPincode: "",
        locationAddress: "",
        requestImageUrl: "",
      }
    );
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, verifiedPersonName: user.name, email: user.email }));
    }
  }, [user]);

  useEffect(() => {
    fetchFormAssets()
      .then((assets) => setHeroImage(assets.donation_request_hero || heroImage))
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.requestImageUrl;
      if (selectedFile) {
        finalImageUrl = await uploadPublicImage(selectedFile);
      }

      const submissionData = {
        ...formData,
        requestImageUrl: finalImageUrl
      };

      const success = await sendEmail(
        "Donor Request",
        submissionData,
        `New Blood Donor Request for ${submissionData.patientName}`
      );

      if (success) {
        clearPendingFormData();
        setFormData({
          verifiedPersonName: user?.name || "",
          phone: "",
          email: user?.email || "",
          patientName: "",
          bloodGroup: "",
          bloodRequestType: "",
          hospitalAddressWithPincode: "",
          locationAddress: "",
          requestImageUrl: "",
        });
        setSelectedFile(null);
        setPreviewUrl("");
        setShowThankYou(true);
      }
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleRequestImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="bg-bg min-h-screen" ref={containerRef}>
      <SEO
        title={`${t("request_donors.title")} | Humanity Calls`}
        description={t("request_donors.seo_desc")}
      />

      <div className="w-full relative h-[400px] md:h-[600px] mb-12">
        <img
          src={heroImage}
          alt={IMAGE_ALTS.bloodDonation}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
          data-animation="req-title"
        >
          <h1 className="text-4xl md:text-7xl font-black text-white text-center px-4 tracking-tighter">
            {t("request_donors.hero_title_part1")}{" "}
            <span className="text-blood">
              {t("request_donors.hero_title_part2")}
            </span>{" "}
          </h1>
        </div>
      </div>

      <div className="max-w-none mx-auto px-[5%] pb-24">
        <div
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-border"
          data-animation="req-form"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blood mb-4">
              {t("request_donors.form_title")}
            </h2>
            <p className="text-text-body">
              {t("request_donors.form_subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-blood-dark uppercase tracking-widest">
                  {t("request_donors.verified_person")}
                </label>
                <input
                  required
                  name="verifiedPersonName"
                  value={formData.verifiedPersonName}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-text-body shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isFieldDisabled("verifiedPersonName")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-blood-dark uppercase tracking-widest">
                  {t("form.phone")}
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  minLength={10}
                  maxLength={10}
                  className="w-full px-4 py-4 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-text-body shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-blood-dark uppercase tracking-widest">
                {t("form.email")}
              </label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-text-body shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isFieldDisabled("email")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-blood-dark uppercase tracking-widest">
                  {t("request_donors.patient_name")}
                </label>
                <input
                  required
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-text-body shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-blood-dark uppercase tracking-widest">
                  {t("request_donors.blood_group")}
                </label>
                <select
                  required
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-text-body shadow-sm"
                >
                  <option value="">{t("request_donors.select_group")}</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-blood-dark uppercase tracking-widest">
                  {t("request_donors.blood_request_type")}
                </label>
                <select
                  required
                  name="bloodRequestType"
                  value={formData.bloodRequestType}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-text-body shadow-sm"
                >
                  <option value="">{t("request_donors.select_type")}</option>
                  <option value={t("request_donors.blood_request_options.whole_blood")}>
                    {t("request_donors.blood_request_options.whole_blood")}
                  </option>
                  <option value={t("request_donors.blood_request_options.rbc")}>
                    {t("request_donors.blood_request_options.rbc")}
                  </option>
                  <option value={t("request_donors.blood_request_options.platelets")}>
                    {t("request_donors.blood_request_options.platelets")}
                  </option>
                  <option value={t("request_donors.blood_request_options.plasma")}>
                    {t("request_donors.blood_request_options.plasma")}
                  </option>
                  <option value={t("request_donors.blood_request_options.cyroprecipitate")}>
                    {t("request_donors.blood_request_options.cyroprecipitate")}
                  </option>
                  <option value={t("request_donors.blood_request_options.wbc")}>
                    {t("request_donors.blood_request_options.wbc")}
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-blood-dark uppercase tracking-widest">
                {t("request_donors.hospital_address")}
              </label>
              <textarea
                required
                name="hospitalAddressWithPincode"
                value={formData.hospitalAddressWithPincode}
                onChange={handleChange}
                rows="3"
                placeholder={t("request_donors.hospital_address_placeholder")}
                className="w-full px-4 py-4 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-text-body shadow-sm"
              ></textarea>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-bold text-blood-dark uppercase tracking-widest">
                  Current Location
                </label>
                <button
                  type="button"
                  onClick={handleAutoLocation}
                  className="text-[10px] px-3 py-1 rounded-lg border border-primary text-primary font-bold"
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
                placeholder="Current area/address"
                className="w-full px-4 py-4 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-text-body shadow-sm"
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-blood-dark uppercase tracking-widest">
                Attach supporting image (optional)
              </label>
              {!previewUrl ? (
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleRequestImage}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full py-8 px-4 border-2 border-dashed border-gray-200 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group-hover:border-blood group-hover:bg-blood/5">
                    <div className="w-12 h-12 bg-white text-blood shadow-sm rounded-xl flex items-center justify-center">
                      <FaCloudUploadAlt size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-700">Click to upload medical document</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-border group shadow-sm">
                  <img
                    src={previewUrl}
                    alt="Request preview"
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
                  <div className="absolute top-2 left-2 bg-blood text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">
                    SELECTED
                  </div>
                </div>
              )}
            </div>

            {renderSubmitButton(
              <Button
                type="submit"
                variant="blood"
                isLoading={loading}
                className="w-full py-5 text-lg shadow-lg shadow-blood/20"
              >
                Request Blood
              </Button>,
              formData,
            )}
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
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blood via-red-400 to-blood" />
              
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <FaCheckCircle size={48} className="animate-bounce" />
              </div>

              <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                Request Submitted! ❤️
              </h2>
              
              <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">
                Your request has been broadcasted to our network. We are doing our best to find a match for you as quickly as possible.
              </p>

              <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-blood/10 text-blood rounded-xl flex items-center justify-center shrink-0">
                  <FaTint size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-blood uppercase tracking-widest leading-none mb-1">Impact Status</p>
                  <p className="text-sm font-bold text-slate-700">Donors being notified...</p>
                </div>
              </div>

              <button
                onClick={() => setShowThankYou(false)}
                className="w-full py-5 rounded-2xl bg-blood text-white font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-blood/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
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

export default withFormAuth(RequestDonors);
