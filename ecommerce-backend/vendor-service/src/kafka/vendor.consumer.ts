// src/kafka/vendor.consumer.ts
import { kafka } from "./kafka.client";
import { VENDOR_TOPICS } from "./vendor.topics";
import nodemailer from "nodemailer";

const consumer = kafka.consumer({ groupId: "vendor-service-group" });

// Configure Nodemailer transporter using .env variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true if using 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send emails
async function sendEmail(to: string, subject: string, text: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
  console.log(`✅ Email sent to ${to} | Subject: ${subject}`);
}

export const connectConsumer = async () => {
  await consumer.connect();
  console.log("✅ Vendor Kafka Consumer connected");

  await consumer.subscribe({ topic: VENDOR_TOPICS.VENDOR_CREATED, fromBeginning: true });
  await consumer.subscribe({ topic: VENDOR_TOPICS.VENDOR_STATUS_UPDATED, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());
      console.log(`📥 Received message on ${topic}:`, payload);

      try {
        if (topic === VENDOR_TOPICS.VENDOR_CREATED) {
          // Send welcome email to new vendor
          await sendEmail(
            payload.email,
            "Welcome to Our Platform",
            `Hi ${payload.name}, your vendor account has been successfully created!`
          );
        }

        if (topic === VENDOR_TOPICS.VENDOR_STATUS_UPDATED) {
          // Notify vendor about status update
          await sendEmail(
            payload.email,
            "Vendor Status Updated",
            `Hi ${payload.name}, your vendor status has changed from ${payload.oldStatus} to ${payload.newStatus}.`
          );
        }
      } catch (err) {
        console.error("❌ Error sending email:", err);
      }
    },
  });
};

