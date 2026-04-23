import FormAsset from "../models/FormAsset.js";
import { v2 as cloudinary } from "cloudinary";

const DEFAULT_ASSETS = {
  donation_request_hero:
    "https://res.cloudinary.com/daokrum7i/image/upload/v1767814234/request_for_donors_digyme.avif",
  donate_page_hero:
    "https://res.cloudinary.com/daokrum7i/image/upload/f_auto,q_auto,w_900/v1767814232/hc_blood_donation_mfwveo.png",
  blood_donation_hero:
    "https://res.cloudinary.com/daokrum7i/image/upload/f_auto,q_auto,w_900/v1767814232/hc_blood_donation_mfwveo.png",
};

export const getFormAssets = async (_req, res) => {
  try {
    const docs = await FormAsset.find().lean();
    const mapped = docs.reduce((acc, doc) => {
      acc[doc.key] = doc.imageUrl;
      return acc;
    }, {});
    res.json({ ...DEFAULT_ASSETS, ...mapped });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch form assets" });
  }
};

export const upsertFormAsset = async (req, res) => {
  try {
    const { key, label } = req.body;
    if (!key) return res.status(400).json({ message: "Asset key is required" });
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const existing = await FormAsset.findOne({ key });
    if (existing?.publicId) {
      await cloudinary.uploader.destroy(existing.publicId).catch(() => null);
    }

    const updated = await FormAsset.findOneAndUpdate(
      { key },
      { key, imageUrl: req.file.path, publicId: req.file.filename, label: label || "" },
      { new: true, upsert: true },
    );
    res.status(201).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Unable to save form image" });
  }
};
