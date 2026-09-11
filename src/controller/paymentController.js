import {paystack } from "../config/payment.js";
import Booking from "../models/Booking.js";
import Guest from "../models/Guest.js";
import Payment from "../models/payment.js";
import { sendBookingConfirmation } from "../utils/sendEmail.js";

export const initializePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).send({ success: false, message: "Booking not found" });
    }

    // Role-based access
    if (req.user.role !== "STAFF") {
      // Guests can only pay for their own bookings
      if (!booking.guest || booking.guest.toString() !== req.user.id.toString()) {
        return res.status(403).send({ success: false, message: "Not your booking" });
      }
    }

    // Prevent double payment
    if (booking.paymentStatus === "paid") {
      return res.status(400).send({ success: false, message: "Booking already paid" });
    }

    // Get guest details from booking
    const guest = await Guest.findById(booking.guest);
    if (!guest) {
      return res.status(404).send({ success: false, message: "Guest not found" });
    }

    // Prepare Paystack request
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

    // Save payment record
    await Payment.create({
      booking: booking._id,
      email: guest.email,
      amount: booking.totalAmount,
      reference,
      status: "pending",
    });

    booking.paymentReference = reference;
    await booking.save();

    return res.send({
      success: true,
      message: "Payment initialized",
      authorizationUrl: response.data.data.authorization_url,
      accessCode: response.data.data.access_code,
      reference: response.data.data.reference,
    });
  } catch (error) {
    console.error("Paystack error:", error.response?.data || error);
    console.error("General error:", error.message);
    return res.status(500).send({ success: false, message: "Payment initialization failed" });
  }
};



// Verify payment

export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    // Verify transaction with Paystack
    const response = await paystack.get(`/transaction/verify/${reference}`);
    const payment = response.data.data;

    // Find payment record in DB
    const paymentDoc = await Payment.findOne({ reference }).populate("booking");
    if (!paymentDoc) {
      return res.status(404).send({ success: false, message: "Payment record not found" });
    }

    // Handle failed payment
    if (payment.status !== "success") {
      paymentDoc.status = "failed";
      await paymentDoc.save();
      return res.status(400).send({ success: false, message: "Payment failed" });
    }

    // Load booking linked to payment
    const booking = await Booking.findById(paymentDoc.booking._id)
      .populate("guest")
      .populate("room");

    if (!booking) {
      return res.status(404).send({ success: false, message: "Booking not found" });
    }

    // Prevent duplicate verification
    if (booking.paymentStatus === "paid") {
      return res.send({ success: true, message: "Payment already verified", booking });
    }

    // Validate amount
    const expectedAmount = Math.round(booking.totalAmount * 100);
    if (payment.amount !== expectedAmount) {
      return res.status(400).send({ success: false, message: "Payment amount does not match booking amount" });
    }

    // Update Payment record
    paymentDoc.status = "success";
    await paymentDoc.save();

    // Update Booking record
    booking.paymentStatus = "paid";
    booking.status = "CONFIRMED"; // match your schema enum
    booking.paymentReference = reference;
    await booking.save();

    // Send confirmation email
    try {
      await sendBookingConfirmation({
        guestName: booking.guest.name,
        guestEmail: booking.guest.email,
        bookingId: booking._id,
        roomNumber: booking.room.roomNumber,
        roomType: booking.room.roomType,
        checkIn: booking.checkInDate,
        checkOut: booking.checkOutDate,
        totalAmount: booking.totalAmount,
      });
      console.log("Confirmation email sent");
    } catch (emailError) {
      console.error("Email failed:", emailError.message);
    }

    return res.send({ success: true, message: "Payment successful. Booking confirmed.", booking });

  } catch (error) {
    console.error("Paystack error:", error.response?.data);
    console.error("General error:", error.message);
    return res.status(500).send({ success: false, message: "Payment verification failed" });
  }
};
