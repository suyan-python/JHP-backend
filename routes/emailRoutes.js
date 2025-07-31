import express from "express";
import PopupEmail from "../models/popupEmailModel.js";
import transporter from "../config/nodemailer.js";

const emailRouter = express.Router();

emailRouter.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if the email already exists in DB
    const existing = await PopupEmail.findOne({ email });

    if (!existing) {
      await PopupEmail.create({ email, subscribe: true });
    }

    // Define mail options
    const mailOptions = {
      from: `"Jewel Himalayan Products" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "A Special Thank You – Enjoy Your Discount on the Next Order!",
      html: `
    <div style="font-family: sans-serif; background-color: #fff; padding: 30px; max-width: 500px; margin: auto; border-radius: 10px; box-shadow: 0 0 12px rgba(0,0,0,0.1);">
      <h2 style="color: #4a2e1b;">Thank You for Shopping With Us! ❤️</h2>
      <p>We're truly grateful to have you as part of our coffee-loving community. Your recent purchase means a lot to us.</p>
      <p>To show our appreciation, here's a special coupon code just for you:</p>
      <h1 style="color: #dc143c; font-size: 32px; letter-spacing: 2px;">JHPFAMILY</h1>
      <p style="margin-top: 12px;">Use this code on your next order and enjoy an exclusive discount – just our little way of saying thank you.</p>
      <p style="margin-top: 16px;">We hope to serve you again soon with more of our finest Himalayan coffee beans.</p>
      <a href="https://store.jewelhimalayanproducts.com" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #4a2e1b; color: #fff; text-decoration: none; border-radius: 6px;">Shop Again & Save</a>
    </div>
  `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);

    res.status(200).json({ message: "Email saved and coupon sent." });
  } catch (err) {
    console.error("Error submitting email:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

export default emailRouter;
