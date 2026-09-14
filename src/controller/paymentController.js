import crypto from "crypto";
import Booking from "../models/Booking.js";
import Guest from "../models/Guest.js";
import Payment from "../models/payment.js";
import { initializeTransaction, verifyTransaction } from "../utils/payment.js";
import { sendBookingConfirmation } from "../utils/sendEmail.js";

// Initialize payment for a booking
export const initializePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).send({ success: false, message: "Booking not found" });
    }

    // Role-based access
    if (req.user.role === "STAFF") {
      // staff can initialize any booking
    } else if (req.user.role === "GUEST") {
      // guest can only initialize their own booking
      if (!booking.guest || booking.guest.toString() !== req.user.guestId?.toString()) {
        return res.status(403).send({ success: false, message: "Not your booking" });
      }
    } else {
      return res.status(403).send({ success: false, message: "Unauthorized role" });
    }

    // Prevent double payment
    if (booking.paymentStatus === "paid") {
      return res.status(400).send({ success: false, message: "Booking already paid" });
    }

    // Get guest details
    const guest = await Guest.findById(booking.guest);
    if (!guest) {
      return res.status(404).send({ success: false, message: "Guest not found" });
    }

    // Prepare Paystack request
    const reference = `booking_${booking._id}_${Date.now()}`;
    const response = await initializeTransaction(guest.email, booking.totalAmount, {
      bookingId: booking._id.toString(),
      guestId: guest._id.toString(),
      reference
    });

    if (!response.status) {
      return res.status(500).send({ success: false, message: "Payment initialization failed" });
    }

    // SDK returns response.data directly
    const { authorization_url, access_code, reference: paystackRef } = response.data;

    // Save payment record
    await Payment.create({
      booking: booking._id,
      email: guest.email,
      amount: booking.totalAmount,
      reference: paystackRef,
      status: "pending",
    });

    booking.paymentReference = reference;
    await booking.save();

    return res.send({
      success: true,
      message: "Payment initialized",
      authorizationUrl: authorization_url,
      accessCode: access_code,
      reference: paystackRef,
    });
  } catch (error) {
    console.error("Paystack error:", error);
    return res.status(500).send({ success: false, message: "Payment initialization failed" });
  }
};

// Verify payment and confirm booking
export const verifyPayment = async (req, res) => {
  try {
    //  Reference comes from URL path, not body
    const { reference } = req.params;

    // Call helper from utils/payment.js
    const response = await verifyTransaction(reference);
    if (!response.status) {
      return res.status(400).send({ success: false, message: "Payment verification failed" });
    }

    //  SDK returns response.data directly
    const paymentData = response.data;

    const paymentDoc = await Payment.findOne({ reference }).populate("booking");
    if (!paymentDoc) {
      return res.status(404).send({ success: false, message: "Payment record not found" });
    }

    if (paymentData.status !== "success") {
      paymentDoc.status = "failed";
      await paymentDoc.save();
      return res.status(400).send({ success: false, message: "Payment failed" });
    }

    const booking = await Booking.findById(paymentDoc.booking._id)
      .populate("guest")
      .populate("room");

    if (!booking) {
      return res.status(404).send({ success: false, message: "Booking not found" });
    }

    if (booking.paymentStatus === "paid") {
      return res.send({ success: true, message: "Payment already verified", booking });
    }

    const expectedAmount = Math.round(booking.totalAmount * 100);
    if (paymentData.amount !== expectedAmount) {
      return res.status(400).send({ success: false, message: "Payment amount mismatch" });
    }

    // Update records
    paymentDoc.status = "success";
    await paymentDoc.save();

    booking.paymentStatus = "paid";
    booking.status = "CONFIRMED";
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
    console.error("Paystack verification error:", error);
    return res.status(500).send({ success: false, message: "Payment verification failed" });
  }
};


// export const paystackWebhook = async (req, res) => {
//   try {
//     const signature = req.headers["x-paystack-signature"];
//     if (!signature) return res.sendStatus(400);

//     const hash = crypto
//       .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
//       .update(req.rawBody)
//       .digest("hex");

//     if (hash !== signature) return res.sendStatus(400);

//     const event = req.body;

//     if (event.event === "charge.success") {
//       const { reference } = event.data;

//       // Verify transaction with Paystack helper
//       const response = await verifyTransaction(reference);
//       if (!response.status) {
//         return res.sendStatus(400);
//       }

//       const payment = await Payment.findOne({ reference }).populate("booking");

//       if (payment && payment.status !== "success") {
//         payment.status = "success";
//         await payment.save();

//         const booking = await Booking.findById(payment.booking._id)
//           .populate("guest")
//           .populate("room");

//         if (booking) {
//           booking.paymentStatus = "paid";
//           booking.status = "CONFIRMED";
//           booking.paymentReference = reference;
//           await booking.save();

//           try {
//             await sendBookingConfirmation({
//               guestName: booking.guest.name,
//               guestEmail: booking.guest.email,
//               bookingId: booking._id,
//               roomNumber: booking.room.roomNumber,
//               roomType: booking.room.roomType,
//               checkIn: booking.checkInDate,
//               checkOut: booking.checkOutDate,
//               totalAmount: booking.totalAmount,
//             });
//             console.log("Confirmation email sent via webhook");
//           } catch (emailError) {
//             console.error("Email failed:", emailError.message);
//           }
//         }
//       }
//     }

//     return res.sendStatus(200);
//   } catch (error) {
//     console.error("Webhook error:", error.message);
//     return res.sendStatus(500);
//   }
// };
