import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

export { Cart };
