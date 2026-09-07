import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Guest from "../models/Guest.js";

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const { roomId, guestId, checkInDate, checkOutDate, totalPrice, createdBy } = req.body;

    // Validate room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).send({ status: "error", msg: "Room not found" });
    }

    // Check overlapping bookings
    const overlappingBooking = await Booking.findOne({
      roomId,
      checkInDate: { $lt: new Date(checkOutDate) },
      checkOutDate: { $gt: new Date(checkInDate) }
    });

    if (overlappingBooking) {
      return res.status(400).send({ status: "error", msg: "Room is not available for these dates" });
    }

    // Create booking
    const booking = new Booking({
      roomId,
      guest: guestId,
      checkInDate,
      checkOutDate,
      totalPrice,
      createdBy
    });

    await booking.save();

    // Update room status
    room.status = "BOOKED";
    await room.save();

    res.status(201).send({ status: "ok", msg: "Booking created successfully", data: booking });
  } catch (error) {
    res.status(400).send({ status: "error", msg: error.message });
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

// Cancel booking by ID (better to mark as CANCELLED instead of delete)
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).send({ status: "error", msg: "Booking not found" });
    }

    booking.status = "CANCELLED";
    await booking.save();

    // Optionally update room status back to AVAILABLE
    const room = await Room.findById(booking.roomId);
    if (room) {
      room.status = "AVAILABLE";
      await room.save();
    }

    res.status(200).send({ status: "ok", msg: "Booking cancelled successfully", data: booking });
  } catch (error) {
    res.status(400).send({ status: "error", msg: error.message });
  }
};
