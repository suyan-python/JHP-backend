import express from "express";
import { submitWholesaleInquiry } from "../controller/wholesaleController.js";

const router = express.Router();

// POST /api/wholesale-inquiry
router.post("/wholesale-inquiry", submitWholesaleInquiry);

export default router;
