import express from "express";
import Order from "../models/Order.js";

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

// PATCH /api/admin/orders/:id/completed
router.patch("/orders/:id/completed", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error updating order completion:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
});

export default router;
