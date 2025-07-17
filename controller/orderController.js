import Order from "../models/Order.js";
import sendEmail from "../utils/sendEmail.js";

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

    const html = `
      <h2>Hello ${firstName} ${lastName},</h2>
      <p>Thank you for your order with Jewel Himalayan Products.</p>
      <h3>Order Summary</h3>
      <ul>${itemsHtml}</ul>
      <p><strong>Subtotal:</strong> NRs. ${total.toFixed(2)}</p>
      ${
        discountedTotal
          ? `<p><strong>Discount:</strong> NRs. ${(
              total - discountedTotal
            ).toFixed(2)}</p>`
          : ""
      }
      <p><strong>Shipping:</strong> NRs. ${(shipping ?? 0).toFixed(2)}</p>
      <p><strong>Total:</strong> NRs. ${finalTotal.toFixed(2)}</p>
      <p><strong>Delivery Time:</strong> ${deliveryTime}</p>
      <p><strong>Address:</strong> ${location?.address || "Not provided"}</p>
      <br/>
      <p>We'll contact you at ${phone} for confirmation.</p>
      <br/>
      <p>Best regards,<br/>Jewel Himalayan Products Team</p>
    `;

    await sendEmail(
      email,
      "🧾 Your Order Confirmation – Jewel Himalayan Products",
      html
    );

    res
      .status(201)
      .json({ message: "Order placed and email sent successfully." });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ error: "Failed to place order or send email." });
  }
};
