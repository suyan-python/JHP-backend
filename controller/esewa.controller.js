import Order from "../models/Order.js";
import { generateEsewaSignature } from "../utils/esewa.js";
import { v4 as uuidv4 } from "uuid";

// export const initiateEsewaPayment = async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       phone,
//       total,
//       finalTotal,
//       items,
//       shipping,
//       location,
//     } = req.body;

//     const transaction_uuid = uuidv4();

//     // ✅ create order FIRST
//     await Order.create({
//       orderId: transaction_uuid,
//       firstName,
//       lastName,
//       phone,
//       total: finalTotal ,
//       items,
//       shipping,
//       location,
//       status: "pending",
//       paymentMethod: "esewa",
//     });

//     const amount = finalTotal;

//     const message = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.MERCHANT_ID}`;

//     const signature = generateEsewaSignature(message, process.env.SECRET);

//     res.json({
//       payment_url: process.env.ESEWAPAYMENT_URL,
//       params: {
//         amount,
//         tax_amount: 0,
//         total_amount: amount,
//         transaction_uuid,
//         product_code: process.env.MERCHANT_ID,
//         product_service_charge: 0,
//         product_delivery_charge: 0,
//         success_url: `${process.env.BACKEND_URL}/api/payment/esewa/success`,
//         failure_url: `${process.env.FRONTEND_URL}/payment-failed`,
//         signed_field_names: "total_amount,transaction_uuid,product_code",
//         signature,
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "eSewa initiation failed" });
//   }
// };

export const initiateEsewaPayment = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      total,
      finalTotal,
      items,
      shipping,
      location,
    } = req.body;

    const transaction_uuid = uuidv4();

    // ✅ USE FINAL TOTAL
    const amount = finalTotal;

    await Order.create({
      orderId: transaction_uuid,
      firstName,
      lastName,
      phone,
      total: amount,
      items,
      shipping,
      location,
      status: "pending",
      paymentMethod: "esewa",
    });

    const message = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.MERCHANT_ID}`;

    const signature = generateEsewaSignature(message, process.env.SECRET);

    res.json({
      payment_url: process.env.ESEWAPAYMENT_URL,
      params: {
        amount,
        tax_amount: 0,
        total_amount: amount,
        transaction_uuid,
        product_code: process.env.MERCHANT_ID,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `${process.env.BACKEND_URL}/api/payment/esewa/success`,
        failure_url: `${process.env.FRONTEND_URL}/payment-failed`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "eSewa initiation failed",
    });
  }
};

export const esewaSuccess = async (req, res) => {
  try {
    const { data } = req.query;

    const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

    const { transaction_uuid, status, total_amount } = decoded;

    const order = await Order.findOne({ orderId: transaction_uuid });

    if (!order) {
      return res.redirect(`${process.env.FRONTEND_URL}/error`);
    }

    if (status === "COMPLETE") {
      order.status = "paid";
      order.transactionId = decoded.transaction_code;
      await order.save();

      return res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
    }

    order.status = "failed";
    await order.save();

    res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.FRONTEND_URL}/error`);
  }
};
