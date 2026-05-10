import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  createBloodRequest,
  listBloodRequests,
  updateBloodRequestStatus,
  deleteBloodRequest,
} from "../controllers/bloodRequestController.js";

const router = express.Router();

router.post("/", createBloodRequest);
router.get("/", protect, adminOnly, listBloodRequests);
router.put("/:id/status", protect, adminOnly, updateBloodRequestStatus);
router.delete("/:id", protect, adminOnly, deleteBloodRequest);

export default router;

