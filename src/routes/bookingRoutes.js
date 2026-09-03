import express from "express";
import { createBooking, checkRoomAvailability, upgradeBooking, cancelBooking } from "../controller/bookingController";

const router = express.Router();

//create new booking
router.post('/booking', createBooking);

//check room availability
router.post('/booking/availability', checkRoomAvailability);

//upgrade booking by id
router.put('/booking/:id', upgradeBooking);

//cancel booking by id
router.delete('/booking/:id', cancelBooking);

export default router;