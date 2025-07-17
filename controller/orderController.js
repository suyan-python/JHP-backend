import Order from "../models/Order.js";
import sendEmail from "../utils/sendEmail.js";

// POST /api/orders
export const placeOrder = async (req, res) => {
  try {
    const orderData = req.body;
    // 1) Save to DB
    const newOrder = new Order(orderData);
    await newOrder.save();

    // 2) Prepare & send confirmation email
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
    } = orderData;
    const finalTotal = (discountedTotal ?? total) + (shipping ?? 0);

    const itemsHtml = items
      .map(
        (i) =>
          `<li>${i.name} &times; ${i.quantity} (${i.selectedSize}g) — NRs. ${(
            i.price * i.quantity
          ).toFixed(2)}</li>`
      )
      .join("");

    const htmlContent = `
      <h2>Hi ${firstName} ${lastName},</h2>
      <p>Thank you for your order at JHP Store. Here are your order details:</p>
      <ul>${itemsHtml}</ul>
      <p><strong>Subtotal:</strong> NRs. ${total.toFixed(2)}</p>
      ${
        discountedTotal
          ? `<p><strong>Discounted Total:</strong> NRs. ${discountedTotal.toFixed(
              2
            )}</p>`
          : ""
      }
      <p><strong>Shipping Fee:</strong> NRs. ${(shipping ?? 0).toFixed(2)}</p>
      <p><strong>Grand Total:</strong> NRs. ${finalTotal.toFixed(2)}</p>
      <p><strong>Delivery Time:</strong> ${orderData.deliveryTime}</p>
      ${
        location
          ? `<p><strong>Delivery Coordinates:</strong> ${location.lat.toFixed(
              5
            )}, ${location.lng.toFixed(5)}</p>`
          : ""
      }
      <p>We’ll call you at ${phone} to confirm delivery details.</p>
      <br/>
      <p>Cheers,<br/>The JHP Store Team</p>
    `;

    await sendEmail(email, "Your JHP Store Order Confirmation", htmlContent);

    res.status(201).json({ message: "Order placed & email sent." });
  } catch (err) {
    console.error("Error in placeOrder:", err);
    res.status(500).json({ error: "Failed to save order or send email." });
  }
};
