import express from "express";
import validate_user from "../middleware/authMiddleware.js";
import { initializePayment, verifyPayment, paystackWebhook } from "../controller/paymentController.js";

const router = express.Router();

router.post("/initialize", validate_user, initializePayment);
router.get("/verify/:reference", validate_user, verifyPayment);
router.post("/webhook", paystackWebhook); // webhook usually doesn’t need auth

export default router;
