import express from "express";
import Order from "../models/Order.js"; // assuming you saved your orders in orders collection

const router = express.Router();

// GET /api/admin/orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to get orders" });
  }
});

export default router;
