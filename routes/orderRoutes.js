import express from "express";
import Order from "../models/Order.js";
import { sendOrderEmail } from "../utils/sendEmail.js"; // 👈 import the function

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    console.log("✅ Order saved, now sending email...");

    await sendOrderEmail(savedOrder); // 👈 this triggers the email

    res.status(201).json({ message: "Order saved and email sent" });
  } catch (error) {
    console.error("❌ Error saving order:", error.message);
    res.status(500).json({ error: "Failed to save order" });
  }
});

export default router;
