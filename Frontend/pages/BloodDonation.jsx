import React, { useEffect, useState } from "react";
import SEO from "../components/SEO";
import Button from "../components/Button";
import { fetchFormAssets } from "../utils/formAssets";
import { getCurrentLocationLabel } from "../utils/location";
import { submitPublicBloodDonation } from "../utils/publicForms";
import { useTranslation } from "react-i18next";

const FALLBACK_HERO =
  "https://res.cloudinary.com/daokrum7i/image/upload/f_auto,q_auto,w_900/v1767814232/hc_blood_donation_mfwveo.png";

const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodDonation = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [heroImage, setHeroImage] = useState(FALLBACK_HERO);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    cityLocation: "",
    availability: "",
    notes: "",
  });

  useEffect(() => {
    fetchFormAssets()
      .then((assets) => setHeroImage(assets.blood_donation_hero || FALLBACK_HERO))
      .catch(() => null);
    getCurrentLocationLabel()
      .then((label) => setFormData((prev) => ({ ...prev, cityLocation: prev.cityLocation || label })))
      .catch(() => null);
  }, []);

  const setCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const label = await getCurrentLocationLabel();
      setFormData((prev) => ({ ...prev, cityLocation: label }));
    } catch (error) {
      // no-op: user denied or timeout
    } finally {
      setLocationLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await submitPublicBloodDonation(formData);
    if (ok) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        bloodGroup: "",
        cityLocation: "",
        availability: "",
        notes: "",
      });
    }
    setLoading(false);
  };

  return (
    <div className="bg-bg min-h-screen pb-24">
      <SEO
        title="Blood Donation Form | Humanity Calls"
        description="Emergency blood donation pledge form. Submit instantly without login."
      />
      <div className="relative h-[280px] md:h-[360px]">
        <img src={heroImage} alt="Blood donation" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl text-white font-black">Blood Donation Form</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-[5%] -mt-10">
        <div className="bg-white rounded-3xl border border-border shadow-xl p-6 md:p-10">
          <p className="text-sm text-gray-600 mb-6">
            Emergency-friendly form: no login required for blood donation pledge.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full px-4 py-3 border border-border rounded-xl"
              />
              <input
                required
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-3 border border-border rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                minLength={10}
                maxLength={10}
                placeholder="Phone (10 digits)"
                className="w-full px-4 py-3 border border-border rounded-xl"
              />
              <select
                required
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border rounded-xl"
              >
                <option value="">Select Blood Group</option>
                {groups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center gap-3">
                <label className="text-sm font-semibold">Current location</label>
                <button
                  type="button"
                  onClick={setCurrentLocation}
                  className="text-xs px-3 py-1.5 rounded-lg border border-primary text-primary font-bold"
                >
                  {locationLoading ? "Locating..." : "Use my location"}
                </button>
              </div>
              <textarea
                required
                rows={2}
                name="cityLocation"
                value={formData.cityLocation}
                onChange={handleChange}
                placeholder="City / area / address"
                className="w-full px-4 py-3 border border-border rounded-xl"
              />
            </div>
            <input
              required
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="Availability (e.g., weekends, after 6 PM)"
              className="w-full px-4 py-3 border border-border rounded-xl"
            />
            <textarea
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Health notes (optional)"
              className="w-full px-4 py-3 border border-border rounded-xl"
            />
            <Button type="submit" isLoading={loading} variant="blood" className="w-full py-4">
              {t("request_donors.submit_request")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BloodDonation;
