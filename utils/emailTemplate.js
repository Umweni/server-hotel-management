// Welcome Email
exports.welcomeTemplate = (firstName, bookingId) => `
  <h1>Welcome to Silver Horizon Hotel</h1>
  
  <p>Dear ${firstName},</p>
  
  <p>Your reservation has been confirmed successfully.</p>
  
  <p><strong>Booking ID:</strong> ${bookingId}</p>
  
  <p>We look forward to hosting you at Silver Horizon Hotel.</p>
  
  <p>Warm regards,<br/>Silver Horizon Hotel Team</p>
`;

// Booking Confirmation
exports.bookingConfirmationTemplate = (firstName, roomType, checkIn, checkOut) => `
  <h2>Booking Confirmation</h2>
  
  <p>Hello ${firstName},</p>
  
  <p>Your booking has been confirmed:</p>
  <ul>
    <li>Room Type: ${roomType}</li>
    <li>Check-In Date: ${checkIn}</li>
    <li>Check-Out Date: ${checkOut}</li>
  </ul>
  
  <p>We are excited to welcome you!</p>
`;

// Payment Receipt
exports.paymentReceiptTemplate = (firstName, amount, currency, reference) => `
  <h2>Payment Receipt</h2>
  
  <p>Hello ${firstName},</p>
  
  <p>We have received your payment of ${currency} ${amount}.</p>
  
  <p><strong>Reference:</strong> ${reference}</p>
  
  <p>Thank you for choosing Silver Horizon Hotel.</p>
`;

// Check-In Reminder
exports.checkInReminderTemplate = (firstName, checkInDate) => `
  <h2>Upcoming Stay Reminder</h2>
  
  <p>Hello ${firstName},</p>
  
  <p>This is a friendly reminder that your check-in date is ${checkInDate}.</p>
  
  <p>We look forward to welcoming you to Silver Horizon Hotel.</p>
`;

// Feedback Request
exports.feedbackTemplate = (firstName) => `
  <h2>We Value Your Feedback</h2>
  
  <p>Hello ${firstName},</p>
  
  <p>Thank you for staying with us at Silver Horizon Hotel.</p>
  
  <p>We would love to hear about your experience. Please take a moment to share your feedback.</p>
  
  <p>Your insights help us serve you better.</p>
`;
