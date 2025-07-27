import Order from "../models/Order.js";
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
      to: email,
      subject: "Order Confirmation - Jewel Himalayan Products",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 24px; border-radius: 8px;">
          <img src="https://toursandtravelsnepal.netlify.app/logo1.png" alt="JHP Logo" style="width: 120px; margin-bottom: 24px;" />

          <h2 style="color: #dc143c;">Your Order Confirmation</h2>

          <p>Dear <strong>${firstName} ${lastName}</strong>,</p>
          <p>Thank you for placing your order with <strong>Jewel Himalayan Products</strong>! Here are your order details:</p>

          <h4>Shipping Info:</h4>
          <ul>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Location:</strong> ${location}</li>
            <li><strong>Delivery Time:</strong> ${
              deliveryTime || "Standard"
            }</li>
          </ul>

          <h4>Items Ordered:</h4>
          <ul>${itemsHtml}</ul>

          <p><strong>Total:</strong> NRs. ${total.toFixed(2)}</p>
          ${
            discountedTotal
              ? `<p><strong>Discounted:</strong> NRs. ${discountedTotal.toFixed(
                  2
                )}</p>`
              : ""
          }
          ${
            shipping
              ? `<p><strong>Shipping:</strong> NRs. ${shipping.toFixed(2)}</p>`
              : ""
          }
          <p><strong>Final Total:</strong> <span style="color: #dc143c;">NRs. ${finalTotal.toFixed(
            2
          )}</span></p>

          <p style="margin-top: 24px;">If you have any questions or need assistance, feel free to contact us.</p>

          <p style="margin-top: 24px; font-size: 12px; color: #777;">© ${new Date().getFullYear()} Jewel Himalayan Products. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Order placed and confirmation email sent successfully.",
    });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ error: "Failed to place order or send email." });
  }
};
