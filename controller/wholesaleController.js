import WholesaleInquiry from "../models/WholesaleInquiry.js";
import sendEmail from "../utils/sendEmail.js"; // optional if sending email

export const submitWholesaleInquiry = async (req, res) => {
  try {
    const {
      firstName,
      email,
      phone,
      businessType,
      location,
      weeklyUsage,
      message,
    } = req.body;

    // Basic validation
    if (
      !firstName ||
      !email ||
      !phone ||
      !businessType ||
      !location ||
      !weeklyUsage
    ) {
      return res
        .status(400)
        .json({ message: "All fields except message are required." });
    }

    const inquiry = await WholesaleInquiry.create({
      firstName,
      email,
      phone,
      businessType,
      location,
      weeklyUsage,
      message,
    });

    // Optional: Send confirmation email
    /*
    await sendEmail({
      to: email,
      subject: "Wholesale Inquiry Received",
      text: `Hi ${firstName},\n\nThank you for your inquiry! Our team will contact you shortly.`,
    });
    */

    res.status(201).json({ message: "Inquiry received successfully", inquiry });
  } catch (error) {
    console.error("Wholesale inquiry error:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};
