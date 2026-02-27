import express from "express";
import { getAnalytics } from "../controller/ai.controller.js";

const router = express.Router();

// router.post("/ai-analysis", getAIInsights);
router.get("/analytics", getAnalytics);

export default router;
