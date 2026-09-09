import Guest from "../models/Guest.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import { sendBookingConfirmation } from "../utils/sendEmail.js";
import { sendBookingCancellation } from "../utils/sendEmail.js";

export const createBooking = async (req, res) => {
  try {
    const { roomId, guestId, checkInDate, checkOutDate } = req.body;

    // Find guest
    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({ success: false, message: "Guest not found" });
    }

    // Validate room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // Convert dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    if (checkOut <= checkIn) {
      return res.status(400).json({ success: false, message: "Check-out must be after check-in" });
    }
    if (checkIn < new Date()) {
      return res.status(400).json({ success: false, message: "Check-in date cannot be in the past" });
    }

    // Check overlapping bookings
    const overlappingBooking = await Booking.findOne({
      room: room._id,
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    });
    if (overlappingBooking) {
      return res.status(400).json({ success: false, message: "Room is not available for these dates" });
    }

    // Calculate nights and price
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.ceil((checkOut - checkIn) / millisecondsPerDay);
    const totalAmount = room.price * nights;

    // Create booking (use schema field names + correct enum value)
    const booking = await Booking.create({
      guest: guest._id,
      room: room._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalAmount,
      status: "CONFIRMED", 
    });

    // Mark room unavailable
    room.available = false;
    await room.save();

    // Send confirmation email (non-blocking)
    try {
      await sendBookingConfirmation({
        guestName: guest.name,
        guestEmail: guest.email,
        bookingId: booking._id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        checkIn: booking.checkInDate,
        checkOut: booking.checkOutDate,
        totalAmount: booking.totalAmount,
      });
      console.log("Booking confirmation email sent");
    } catch (emailError) {
      console.error("Email failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Room booked successfully. Confirmation email sent.",
      booking: {
        id: booking._id,
        room: room.roomNumber,
        checkIn: booking.checkInDate,
        checkOut: booking.checkOutDate,
        totalAmount: booking.totalAmount,
        status: booking.status,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to create booking" });
  }
};



// Check room availability
export const checkRoomAvailability = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    const overlappingBooking = await Booking.findOne({
      roomId,
      checkInDate: { $lt: new Date(checkOutDate) },
      checkOutDate: { $gt: new Date(checkInDate) }
    });

    if (overlappingBooking) {
      return res.status(200).send({ status: "ok", msg: "Room is NOT available" });
    }

    res.status(200).send({ status: "ok", msg: "Room is available" });
  } catch (error) {
    res.status(400).send({ status: "error", msg: error.message });
  }
};

// Update booking by ID
export const upgradeBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!booking) {
      return res.status(404).send({ status: "error", msg: "Booking not found" });
    }
    res.status(200).send({ status: "ok", msg: "Booking updated successfully", data: booking });
  } catch (error) {
    res.status(400).send({ status: "error", msg: error.message });
  }
};

//cancel booking
export const cancelBooking = async (req, res) => {
  try {
    // Use the correct param name based on your route
    const bookingId = req.params.bookingId || req.params.id;

    const booking = await Booking.findById(bookingId)
      .populate("room")
      .populate("guest");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status === "CANCELLED") {
      return res.json({ success: true, message: "Booking already cancelled", booking });
    }

    booking.status = "CANCELLED";
    await booking.save();

    if (booking.room) {
      booking.room.available = true;
      await booking.room.save();
    }

    try {
      await sendBookingCancellation({
        guestName: booking.guest?.name || "Guest",
        guestEmail: booking.guest?.email,
        bookingId: booking._id,
        roomNumber: booking.room.roomNumber,
        roomType: booking.room.roomType,
        checkIn: booking.checkInDate,
        checkOut: booking.checkOutDate,
        totalAmount: booking.totalAmount,
      });
      console.log("Cancellation email sent");
    } catch (emailError) {
      console.error("Cancellation email failed:", emailError.message);
    }

    return res.json({
      success: true,
      message: "Booking cancelled successfully. Room is now available.",
      booking,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};
