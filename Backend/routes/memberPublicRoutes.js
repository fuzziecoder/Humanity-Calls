import express from "express";
import { getPublicMemberCard, postEmergencyAlert } from "../controllers/memberPublicController.js";

const router = express.Router();

router.get("/card/:userId", getPublicMemberCard);
router.post("/emergency", postEmergencyAlert);

export default router;
