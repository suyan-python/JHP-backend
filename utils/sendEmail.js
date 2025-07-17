// utils/email.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.BREVO_USER, // your Brevo login email
    pass: process.env.BREVO_PASS, // your Brevo SMTP password
  },
});

export const sendOrderEmail = async (order) => {
  const itemsList = order.items
    .map(
      (item) =>
        `<li>${item.name} - ${item.selectedSize}g × ${item.quantity} = Rs. ${item.price}</li>`
    )
    .join("");

  const htmlContent = `
    <h2>Thank you for your order, ${order.firstName}!</h2>
    <p>We've received your order and will begin processing it shortly.</p>
    <h4>Order Summary:</h4>
    <ul>${itemsList}</ul>
    <p><strong>Total:</strong> Rs. ${order.total}</p>
    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    <p><strong>Delivery Address:</strong> ${
      order.location?.address || "N/A"
    }</p>
    <p>We'll contact you if we need any further information.</p>
    <p>Best regards,<br>Jewel Himalayan Products</p>
  `;

  await transporter.sendMail({
    from: '"Jewel Himalayan Products" <no-reply@jewelhimalayanproducts.com>',
    to: order.email,
    subject: `🧾 Order Confirmation - ${order.orderId}`,
    html: htmlContent,
  });
};
