import express from "express";
import rateLimit from "express-rate-limit";
import Feedback from "../models/Feedback.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const feedbackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: "Too many feedback submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public: Submit feedback (no auth required)
router.post("/", feedbackLimiter, async (req, res) => {
  try {
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: "Name and message are required." });
    }

    const feedback = await Feedback.create({
      name: name.trim(),
      message: message.trim(),
    });

    res.status(201).json({ message: "Feedback submitted successfully!", feedback });
  } catch (error) {
    console.error("Feedback submission error:", error);
    res.status(500).json({ message: "Failed to submit feedback." });
  }
});

// Admin: Get all feedback
router.get("/", protect, adminOnly, async (_req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedback." });
  }
});

// Admin: Update feedback status
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "reviewed", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }

    res.status(200).json({ message: `Feedback marked as ${status}`, feedback });
  } catch (error) {
    res.status(500).json({ message: "Failed to update feedback status." });
  }
});

// Admin: Delete feedback
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }
    res.status(200).json({ message: "Feedback deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete feedback." });
  }
});

export default router;
