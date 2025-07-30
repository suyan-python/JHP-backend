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

    const discountAmount =
      total && finalTotal
        ? (Number(total) - Number(finalTotal)).toFixed(2)
        : null;

    const mailOptions = {
      from: `"Jewel Himalayan Products" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Order Confirmation - Jewel Himalayan Products",
      html: `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 32px; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center;">
        <img src="https://store.jewelhimalayanproducts.com/store.png" alt="JHP Logo" style="width: 140px; margin-bottom: 20px;" />
        <h2 style="color: #4a2e1b;">Thank you for your order!</h2>
      </div>

      <p style="font-size: 16px;">Hi <strong>${firstName} ${lastName}</strong>,</p>
      <p style="font-size: 15px;">We’ve received your order and are preparing it for shipment. Below are your order details:</p>

      <h3 style="color: #4a2e1b; margin-top: 24px;">Shipping Information</h3>
      <ul style="list-style-type: none; padding-left: 0; font-size: 15px; color: #333;">
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Address:</strong> ${location?.address} (${location?.lat}, ${
        location?.lng
      })</li>
        <li><strong>Delivery Time:</strong> ${deliveryTime || "Standard"}</li>
      </ul>

      <h3 style="color: #4a2e1b; margin-top: 24px;">Items Ordered</h3>
      <ul style="padding-left: 20px; font-size: 15px; color: #333;">${itemsHtml}</ul>

      <div style="margin-top: 24px; font-size: 15px; border-top: 1px dashed #ccc; padding-top: 16px;">
        <p><strong>Total:</strong> NRs. ${Number(total || 0).toFixed(2)}</p>
        ${
          discountAmount
            ? `<p><strong>Discount:</strong> -NRs. ${discountAmount}</p>`
            : ""
        }
        ${
          shipping !== undefined && !isNaN(Number(shipping))
            ? `<p><strong>Shipping:</strong> NRs. ${Number(shipping).toFixed(
                2
              )}</p>`
            : ""
        }
        <p style="font-size: 17px; margin-top: 10px;"><strong>Final Total:</strong> <span style="color: #4a2e1b;">NRs. ${Number(
          finalTotal || 0
        ).toFixed(2)}</span></p>
      </div>

      <div style="text-align: center; margin-top: 32px;">
        <a href="https://store.jewelhimalayanproducts.com" style="background-color: #4a2e1b; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px;">Shop More</a>
      </div>

      <p style="margin-top: 40px; font-size: 13px; color: #888; text-align: center;">If you have any questions, feel free to reply to this email.</p>
      <p style="font-size: 12px; color: #aaa; text-align: center;">© ${new Date().getFullYear()} Jewel Himalayan Products. All rights reserved.</p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Order placed and confirmation email sent successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to place order or send email." });
  }
};
