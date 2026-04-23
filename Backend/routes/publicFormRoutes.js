import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import rateLimit from "express-rate-limit";
import { submitPublicBloodDonation } from "../controllers/publicFormController.js";
import { uploadFileOnly } from "../controllers/galleryController.js";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "humanity_calls_public_forms",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: "Too many submissions, please retry shortly." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/blood-donation", submitLimiter, submitPublicBloodDonation);
router.post("/upload-image", submitLimiter, upload.single("image"), uploadFileOnly);

export default router;
