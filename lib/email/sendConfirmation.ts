import nodemailer from "nodemailer";

export async function sendBookingConfirmationEmail(
  to: string,
  customerName: string,
  bookingDetails: {
    serviceTitle: string;
    date: string;
    time: string;
    totalPrice: number;
  }
) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Blink Creative Studio" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Booking Confirmation - Blink Creative Studio",
    html: `
      <h2>Hello ${customerName},</h2>
      <p>Your booking has been successfully received.</p>

      <h3>Booking Details:</h3>
      <ul>
        <li><strong>Service:</strong> ${bookingDetails.serviceTitle}</li>
        <li><strong>Date:</strong> ${bookingDetails.date}</li>
        <li><strong>Time:</strong> ${bookingDetails.time}</li>
        <li><strong>Total:</strong> ₱${bookingDetails.totalPrice}</li>
      </ul>

      <p>We will verify your payment and send another confirmation shortly.</p>

      <br/>
      <p>Thank you,<br/>Blink Creative Studio</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
