import express from "express";
import Order from "../models/Order.js";
import WholesaleInquiry from "../models/WholesaleInquiry.js";
import Newsletter from "../models/Newsletter.js";

const router = express.Router();

// GET /api/admin/orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders" });
  }
});

// GET /api/admin/orders
router.get("/wholesale", async (req, res) => {
  try {
    const orders = await WholesaleInquiry.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
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
      { new: true },
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
});

// DELETE /api/admin/orders/:id
router.delete("/orders/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order" });
  }
});

router.delete("/wholesale/:id", async (req, res) => {
  try {
    const deletedWholesale = await WholesaleInquiry.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedWholesale) {
      return res.status(404).json({ message: "Wholesale inquiry not found" });
    }
    res.json({ message: "Wholesale inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete wholesale inquiry" });
  }
});

router.delete("/newsletter/:id", async (req, res) => {
  try {
    const deletedNewsletter = await Newsletter.findByIdAndDelete(req.params.id);
    if (!deletedNewsletter) {
      return res.status(404).json({ message: "Newsletter not found" });
    }
    res.json({ message: "Newsletter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete newsletter" });
  }
});

// PATCH /api/admin/orders/:id/status
router.patch("/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "paid"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

export default router;
