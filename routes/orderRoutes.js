import express from "express";
import Order from "../models/Order.js";
import { sendOrderEmail } from "../utils/sendEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();

    if (newOrder.email) {
      await sendOrderEmail(newOrder);
    }

    res
      .status(201)
      .json({ message: "Order saved and email sent successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to save order or send email" });
  }
});

export default router;
