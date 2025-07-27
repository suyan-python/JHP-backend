import Order from "../models/Order.js";
import sendEmail from "../utils/sendEmail.js";
import transporter from "../config/nodemailer.js";

export const placeOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = new Order(orderData);
    await newOrder.save();

    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      items,
      total,
      discountedTotal,
      shipping,
      deliveryTime,
    } = orderData;

    const finalTotal = (discountedTotal ?? total) + (shipping ?? 0);

    const itemsHtml = items
      .map(
        (i) =>
          `<li>${i.name} × ${i.quantity} (${i.selectedSize}g) — NRs. ${(
            i.price * i.quantity
          ).toFixed(2)}</li>`
      )
      .join("");

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.email,
      subject: "Your Order Confirmation - JHP Store",
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 24px; border-radius: 8px;">
      <img src="https://toursandtravelsnepal.netlify.app/logo1.png" alt="Logo" style="width: 120px; margin-bottom: 24px;" />

      <h2 style="color: #dc143c;">Your Booking Confirmation</h2>

      <p>Dear <strong>${req.user.username}</strong>,</p>
      <p>Thank you for booking with <strong>Tours & Travels</strong>! Here are your booking details:</p>

      <table style="width: 100%; margin-top: 16px; border-collapse: collapse;">
        <tr>
          <td><strong>Package Name:</strong></td>
          <td>${roomData.packageName}</td>
        </tr>
        <tr>
          <td><strong>Booking ID:</strong></td>
          <td>${booking._id}</td>
        </tr>
        <tr>
          <td><strong>Agency Name:</strong></td>
          <td>${roomData.hotel.name}</td>
        </tr>
        <tr>
          <td><strong>Location:</strong></td>
          <td>${roomData.hotel.address}</td>
        </tr>
        <tr>
          <td><strong>Check-In Date:</strong></td>
          <td>${checkIn.toDateString()}</td>
        </tr>
        <tr>
          <td><strong>Check-Out Date:</strong></td>
          <td>${checkOut.toDateString()}</td>
        </tr>
        <tr>
          <td><strong>Total Amount:</strong></td>
          <td>${process.env.CURRENCY || "$"} ${booking.totalPrice}</td>
        </tr>
      </table>

      <p style="margin-top: 24px;">We look forward to welcoming you. If you need to make any changes, feel free to reach out to us.</p>
      <p style="margin-top: 24px; font-size: 12px; color: #777;">© ${new Date().getFullYear()} Tours & Travels. All rights reserved.</p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ message: "Order placed and email sent successfully." });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ error: "Failed to place order or send email." });
  }
};
