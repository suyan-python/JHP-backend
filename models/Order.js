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
    shipping: { type: Number },
    orderId: { type: String },

    /** 🌍 New field: Delivery Location */
    location: {
      address: { type: String }, // Optional readable address
      lat: { type: Number, required: false }, // Latitude
      lng: { type: Number, required: false }, // Longitude
    },

    items: [
      {
        itemId: { type: Number, required: true },
        name: { type: String, required: true },
        selectedSize: { type: Number, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        type: { type: String },
        process: { type: String },
      },
    ],

    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
