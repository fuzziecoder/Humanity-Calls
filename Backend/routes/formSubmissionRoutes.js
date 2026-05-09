import express from "express";
import { protect, adminOnly, optionalProtect } from "../middleware/auth.js";
import {
  createFormSubmission,
  deleteFormSubmission,
  listFormSubmissions,
} from "../controllers/formSubmissionController.js";

const router = express.Router();

router.post("/:kind", optionalProtect, createFormSubmission);
router.get("/", protect, adminOnly, listFormSubmissions);
router.delete("/:id", protect, adminOnly, deleteFormSubmission);

export default router;

