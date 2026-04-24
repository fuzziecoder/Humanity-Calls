import React, { useEffect, useMemo, useState } from "react";
import { fetchFormAssets, uploadFormAsset } from "../../utils/formAssets";
import { toast } from "react-toastify";
import { FaUpload, FaImages } from "react-icons/fa";

const ASSET_CONFIG = [
  { key: "donation_request_hero", label: "Donation Request Form Hero" },
  { key: "donate_page_hero", label: "Donate Form Hero" },
  { key: "blood_donation_hero", label: "Blood Donation Form Hero" },
];

const FormImagesManager = () => {
  const [assets, setAssets] = useState({});
  const [loadingKey, setLoadingKey] = useState("");

  const token = useMemo(() => sessionStorage.getItem("adminToken"), []);

  const loadAssets = async () => {
    try {
      const data = await fetchFormAssets();
      setAssets(data);
    } catch (_err) {
      toast.error("Failed to load form images");
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleFile = async (key, label, file) => {
    if (!file) return;
    if (!token) {
      toast.error("Admin token missing. Please login again.");
      return;
    }
    setLoadingKey(key);
    try {
      await uploadFormAsset(token, { key, label, file });
      toast.success("Form image updated");
      await loadAssets();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Image upload failed");
    } finally {
      setLoadingKey("");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <h2 className="text-3xl font-bold text-primary flex items-center gap-3 mb-8">
        <FaImages /> Form Images Manager
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {ASSET_CONFIG.map((asset) => (
          <div key={asset.key} className="border border-border rounded-2xl p-4 bg-bg/40">
            <p className="font-bold text-sm text-text-body mb-3">{asset.label}</p>
            <div className="aspect-video rounded-xl border border-border overflow-hidden bg-white">
              {assets[asset.key] ? (
                <img src={assets[asset.key]} alt={asset.label} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
              )}
            </div>
            <label className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold cursor-pointer hover:bg-primary/90 transition-all">
              <FaUpload />
              {loadingKey === asset.key ? "Uploading..." : "Upload"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(asset.key, asset.label, e.target.files?.[0])}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormImagesManager;
