import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    deliveryTime: { type: String },
    subscribe: { type: Boolean, default: false },
    paymentMethod: { type: String, required: true },
    total: { type: Number, required: true },
    discountedTotal: { type: Number },
    shipping: { type: Number }, // Optional shipping fee
    orderId: { type: String }, // Optional unique order ID
    items: [
      {
        itemId: { type: Number, required: true },
        name: { type: String, required: true },
        selectedSize: { type: Number, required: true }, // e.g., 250, 500, 1000
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // unit price
        type: { type: String }, // optional, e.g., "washed process"
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
