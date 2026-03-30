import nodemailer from "nodemailer";

export async function sendTalkToOurTeamEmail(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
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
    to: process.env.GMAIL_USER, // Send to your studio email
    subject: `New Event Inquiry from ${data.name}`,
    html: `
      <h2>New Event Inquiry</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}