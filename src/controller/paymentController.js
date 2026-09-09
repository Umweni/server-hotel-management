import paystack from "../config/payment.js";
import Booking from "../models/Booking.js";
import Guest from "../models/Guest.js";
import { sendBookingConfirmation } from "../utils/sendEmail.js";

// Initialize payment
export const initializePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.guest.toString() !== req.guestId.toString()) {
      return res.status(403).json({ success: false, message: "Not your booking" });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ success: false, message: "Booking already paid" });
    }

    const guest = await Guest.findById(req.guestId);
    if (!guest) {
      return res.status(404).json({ success: false, message: "Guest not found" });
    }

    const amountInKobo = Math.round(booking.totalAmount * 100);
    const reference = `booking_${booking._id}_${Date.now()}`;

    const response = await paystack.post("/transaction/initialize", {
      email: guest.email,
      amount: amountInKobo,
      reference,
      metadata: {
        bookingId: booking._id.toString(),
        guestId: guest._id.toString(),
      },
    });

    booking.paymentReference = reference;
    await booking.save();

    return res.json({
      success: true,
      message: "Payment initialized",
      authorizationUrl: response.data.data.authorization_url,
      accessCode: response.data.data.access_code,
      reference: response.data.data.reference,
    });

  } catch (error) {
    console.error("Paystack error:", error.response?.data);
    console.error("General error:", error.message);
    return res.status(500).json({ success: false, message: "Payment initialization failed" });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await paystack.get(`/transaction/verify/${reference}`);
    const payment = response.data.data;

    if (payment.status !== "success") {
      return res.status(400).json({ success: false, message: "Payment failed" });
    }

    const bookingId = payment.metadata.bookingId;
    const booking = await Booking.findById(bookingId)
      .populate("guest")
      .populate("room");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.paymentStatus === "paid") {
      return res.json({ success: true, message: "Payment already verified", booking });
    }

    const expectedAmount = Math.round(booking.totalAmount * 100);
    if (payment.amount !== expectedAmount) {
      return res.status(400).json({ success: false, message: "Payment amount does not match booking amount" });
    }

    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    booking.paymentReference = reference;
    await booking.save();

    try {
      await sendBookingConfirmation({
        guestName: booking.guest.name,
        guestEmail: booking.guest.email,
        bookingId: booking._id,
        roomNumber: booking.room.roomNumber,
        roomType: booking.room.roomType,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalAmount: booking.totalAmount,
      });
      console.log("Confirmation email sent");
    } catch (emailError) {
      console.error("Email failed:", emailError.message);
    }

    return res.json({ success: true, message: "Payment successful. Booking confirmed.", booking });

  } catch (error) {
    console.error("Paystack error:", error.response?.data);
    console.error("General error:", error.message);
    return res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
