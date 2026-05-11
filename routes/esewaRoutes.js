import express from "express";

import {
  esewaSuccess,
  initiateEsewaPayment,
} from "../controller/esewa.controller.js";

const router = express.Router();

// POST /api/esewa
router.post("/esewa/initiate", initiateEsewaPayment);
router.get("/esewa/success", esewaSuccess);

export default router;
