import express from "express";
import { initializePayment, verifyPayment } from "../controller/paymentController.js";

const router = express.Router();

// Initialize payment for a booking
router.post("/payments/initialize", initializePayment);

// Verify payment after Paystack callback
router.get("/payments/verify/:reference", verifyPayment);

export default router;
