import express from "express";
import { placeOrder } from "../controller/orderController.js";

const orderRouter = express.Router();

// ✅ This is enough
orderRouter.post("/", placeOrder);

export default orderRouter;
