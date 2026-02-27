import express from "express";
import Newsletter from "../models/Newsletter.js";

const router = express.Router();

// POST subscribe
router.post("/subscribe", async (req, res) => {
  try {
    const { email, source, subscribedAt } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existing = await Newsletter.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Email already subscribed" });
    }

    const newSubscriber = await Newsletter.create({
      email,
      source: source || "Unknown",
      subscribedAt: subscribedAt || new Date(),
    });

    res.status(201).json({
      message: "Successfully subscribed",
      data: newSubscriber,
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
