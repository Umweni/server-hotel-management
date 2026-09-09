import { transporter } from "../config/mail.js";

export const sendBookingConfirmation = async ({
  guestName,
  guestEmail,
  bookingId,
  roomNumber,
  roomType,
  checkIn,
  checkOut,
  totalAmount,
}) => {
  const email = {
    from: process.env.EMAIL_FROM,
    to: guestEmail,
    subject: `Booking Confirmed - ${bookingId}`,
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 10px;
      ">
        <h1 style="color: green;">Booking Confirmed!</h1>

        <p>Hello <strong>${guestName}</strong>,</p>
        <p>Your hotel room has been successfully booked.</p>

        <h2>Booking Details</h2>
        <table style="width: 100%;">
          <tr><td><strong>Booking ID:</strong></td><td>${bookingId}</td></tr>
          <tr><td><strong>Room:</strong></td><td>${roomNumber}</td></tr>
          <tr><td><strong>Room Type:</strong></td><td>${roomType}</td></tr>
          <tr><td><strong>Check-in:</strong></td><td>${new Date(checkIn).toDateString()}</td></tr>
          <tr><td><strong>Check-out:</strong></td><td>${new Date(checkOut).toDateString()}</td></tr>
          <tr><td><strong>Total:</strong></td><td>₦${Number(totalAmount).toLocaleString()}</td></tr>
        </table>

        <br>
        <p>Thank you for choosing our hotel.</p>
        <p>We look forward to welcoming you.</p>
        <p><strong>Hotel Management</strong></p>
      </div>
    `,
  };

  await transporter.sendMail(email);
};



export const sendBookingCancellation = async ({
  guestName,
  guestEmail,
  bookingId,
  roomNumber,
  roomType,
  checkIn,
  checkOut,
  totalAmount,
}) => {
  const email = {
    from: process.env.EMAIL_FROM,
    to: guestEmail,
    subject: `Booking Cancelled - ${bookingId}`,
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        border: 1px solid #ddd;
        border-radius: 10px;
      ">
        <h1 style="color: red;">Booking Cancelled</h1>

        <p>Hello <strong>${guestName}</strong>,</p>
        <p>Your hotel booking has been cancelled as requested.</p>

        <h2>Cancelled Booking Details</h2>
        <table style="width: 100%;">
          <tr><td><strong>Booking ID:</strong></td><td>${bookingId}</td></tr>
          <tr><td><strong>Room:</strong></td><td>${roomNumber}</td></tr>
          <tr><td><strong>Room Type:</strong></td><td>${roomType}</td></tr>
          <tr><td><strong>Original Check-in:</strong></td><td>${new Date(checkIn).toDateString()}</td></tr>
          <tr><td><strong>Original Check-out:</strong></td><td>${new Date(checkOut).toDateString()}</td></tr>
          <tr><td><strong>Total Amount:</strong></td><td>₦${Number(totalAmount).toLocaleString()}</td></tr>
        </table>

        <br>
        <p>If this cancellation was made in error, please contact us immediately to rebook.</p>
        <p>We hope to host you at our hotel in the future.</p>
        <p><strong>Hotel Management</strong></p>
      </div>
    `,
  };

  await transporter.sendMail(email);
};
