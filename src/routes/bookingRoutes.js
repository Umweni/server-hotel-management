import express from "express";
import {
  createBooking,
  checkRoomAvailability,
  upgradeBooking,
  cancelBooking
} from "../controller/bookingController.js";

const router = express.Router();

// create new booking
router.post("/createBooking", createBooking);

// check room availability
router.post("/availability", checkRoomAvailability);

// upgrade booking by id
router.put("/:id", upgradeBooking);

// cancel booking by id
router.delete("/cancelBooking/:id", cancelBooking);

export default router;
