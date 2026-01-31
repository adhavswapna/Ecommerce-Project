import dotenv from "dotenv";
dotenv.config(); // ✅ LOAD ENV FIRST

import nodemailer from "nodemailer";

console.log("SMTP DEBUG (service):", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  return transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
}

