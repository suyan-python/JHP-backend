import express from "express";
import { addToCart, getCart, clearCart } from "../controller/cartController.js";

const router = express.Router();

router.post("/add", addToCart); // Add item to cart
router.get("/", getCart); // Get all cart items
router.delete("/", clearCart); // Clear cart

export { router as cartRoutes };
