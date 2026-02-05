// sendEmail.ts
import "dotenv/config"; // <-- ensures .env is loaded
import nodemailer from "nodemailer";

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true if using 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send email
export async function sendEmail(to: string, subject: string, text: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ SMTP credentials are missing in .env");
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"E-Commerce" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent successfully:", info.messageId, "to", to);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}

// Self-test when running this file directly
if (require.main === module) {
  (async () => {
    await sendEmail(
      process.env.SMTP_USER || "your-email@gmail.com",
      "Test Email from E-Commerce",
      "This is a test email to verify SMTP configuration 🎉"
    );
  })();
}

