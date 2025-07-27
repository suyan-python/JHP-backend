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

    const finalTotal =
      Number(discountedTotal || total || 0) + Number(shipping || 0);

    const itemsHtml = items
      .map((i) => {
        const price = Number(i.price);
        const quantity = Number(i.quantity);
        const total = !isNaN(price * quantity)
          ? (price * quantity).toFixed(2)
          : "N/A";

        return `<li>${i.name} × ${quantity} (${i.selectedSize}g) — NRs. ${total}</li>`;
      })
      .join("");

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Order Confirmation - Jewel Himalayan Products",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 24px; border-radius: 8px;">
          <img src="https://store.jewelhimalayanproducts.com/store.png" alt="JHP Logo" style="width: 120px; margin-bottom: 24px;" />

          <h2 style="color: #5a3114;">Your Order Confirmation</h2>

          <p>Dear <strong>${firstName} ${lastName}</strong>,</p>
          <p>Thank you for placing your order with <strong>Jewel Himalayan Products</strong>! Here is your order detail:</p>

          <h4>Shipping Info:</h4>
          <ul>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Location:</strong> ${location.lat} ${location.lng} ${
        location.address
      }</li>
            <li><strong>Delivery Time:</strong> ${
              deliveryTime || "Standard"
            }</li>
          </ul>

          <h4>Items Ordered:</h4>
          <ul>${itemsHtml}</ul>

        <p><strong>Total:</strong> NRs. ${Number(total || 0).toFixed(2)}</p>
        <p><strong>Final Total:</strong> <span style="color: #5a3114;">NRs. ${Number(
          finalTotal
        ).toFixed(2)}</span></p>

${
  discountedTotal !== undefined && !isNaN(Number(discountedTotal))
    ? `<p><strong>Discounted:</strong> NRs. ${Number(discountedTotal).toFixed(
        2
      )}</p>`
    : ""
}
${
  shipping !== undefined && !isNaN(Number(shipping))
    ? `<p><strong>Shipping:</strong> NRs. ${Number(shipping).toFixed(2)}</p>`
    : ""
}

          <p><strong>Final Total:</strong> <span style="color: #5a3114;">NRs. ${finalTotal.toFixed(
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
