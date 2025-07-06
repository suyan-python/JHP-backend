import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

// Database and Routes
// import connectDBMOGO from "./config/db.js";
import connectDB from "./config/db.js";
import { productRoutes } from "./routes/productRoutes.js";
import { cartRoutes } from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Payment Controllers
import {
  EsewaInitiatePayment,
  paymentStatus,
} from "./controller/esewa.controller.js";

// Initialize environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// App initialization
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.get("/api/health", (req, res) => res.send("Backend Server Running ✅"));
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.post("/initiate-payment", EsewaInitiatePayment);
app.post("/payment-status", paymentStatus);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
