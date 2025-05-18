import express from "express";
import { createProduct, getProducts } from "../controller/productController.js";

const router = express.Router();

router.post("/", createProduct); // add a new product
router.get("/", getProducts); // get all products

export { router as productRoutes };
