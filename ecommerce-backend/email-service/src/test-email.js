// src/test-mail.js
require("dotenv").config({ path: "../.env" });
const nodemailer = require("nodemailer");

async function testMail() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true if using 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "swapnaadhav123@gmail.com",
      subject: "Kafka SMTP Test",
      text: "This is a test email to confirm SMTP works.",
    });

    console.log("Test email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending test email:", err);
  }
}

testMail();

