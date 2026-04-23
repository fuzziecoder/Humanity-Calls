import mongoose from "mongoose";

const formAssetSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      enum: ["donation_request_hero", "donate_page_hero", "blood_donation_hero"],
      required: true,
      unique: true,
    },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    label: { type: String, default: "" },
  },
  { timestamps: true },
);

const FormAsset = mongoose.model("FormAsset", formAssetSchema);
export default FormAsset;
