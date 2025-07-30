import express from "express";
import Order from "../models/Order.js";
import transporter from "../config/nodemailer.js";

const emailRouter = express.Router();

emailRouter.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check if email already subscribed in Order collection
    const existing = await Order.findOne({ email, subscribe: true });

    if (!existing) {
      await Order.create({
        email,
        subscribe: true,
        paymentMethod: "none",
        total: 0,
        status: "pending",
        items: [],
      });
    }

    // Send discount email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "🎁 Your Discount Code - Jewel Himalayan Products",
      html: `
        <div style="font-family: sans-serif; background-color: #fff; padding: 30px; max-width: 500px; margin: auto; border-radius: 10px; box-shadow: 0 0 12px rgba(0,0,0,0.1);">
          <h2 style="color: #4a2e1b;">Enjoy Your Discount 🎉</h2>
          <p>Thank you for signing up! Here's your exclusive coupon code:</p>
          <h1 style="color: #dc143c; font-size: 32px;">FROMMAIL</h1>
          <p style="margin-top: 12px;">Use this code at checkout to get your special discount.</p>
          <a href="https://store.jewelhimalayanproducts.com" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4a2e1b; color: #fff; text-decoration: none; border-radius: 6px;">Shop Now</a>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email saved and coupon sent." });
  } catch (err) {
    console.error("Error saving email:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
});

export default emailRouter;
