import "dotenv/config";
import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true if using port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send email function
export async function sendEmail(to: string, subject: string, text: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error("❌ SMTP credentials missing in .env");
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

// ✅ Optional: test email if run directly
if (require.main === module) {
  (async () => {
    await sendEmail(
      process.env.SMTP_USER || "your-email@gmail.com",
      "Test Email from E-Commerce",
      "This is a test email to verify SMTP configuration 🎉"
    );
  })();
}

