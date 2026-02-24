// src/kafka/email.consumer.ts
import { getKafka } from "./kafka.client";
import { EMAIL_TOPICS, type EmailTopic } from "./email.topics";
import { sendEmail } from "./sendEmail";

// ---------------- Helper: fetch emails for inventory alerts ----------------
function getEmailsForInventory(productId: string): string[] {
  // In production, fetch from DB, config, or admin notification list
  return ["swapnaadhav123@gmail.com"];
}

export async function startEmailConsumer() {
  if (process.env.ENABLE_KAFKA !== "true") {
    console.log("⚠️ Kafka disabled for email-service");
    return;
  }

  const kafka = getKafka();
  const consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID || "email-service-group",
  });

  await consumer.connect();
  await consumer.subscribe({
    topics: [...Object.values(EMAIL_TOPICS)],
    fromBeginning: false,
  });

  console.log("📨 Email Kafka consumer started");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      const raw = message.value.toString().trim();
      if (!raw) return;

      let payload: any;
      try {
        payload = JSON.parse(raw);
      } catch {
        console.error(`❌ Invalid JSON on topic ${topic}`, raw);
        return;
      }

      // ---------------- PASSWORD RESET ----------------
      if (topic === EMAIL_TOPICS.AUTH_PASSWORD_RESET) {
        if (!payload.to || !payload.subject || !payload.html) {
          console.warn("⚠️ Invalid password reset payload", payload);
          return;
        }

        try {
          await sendEmail(payload.to, payload.subject, payload.html);
          console.log(`✅ Password reset email sent to ${payload.to}`);
        } catch (err) {
          console.error("🔥 Failed to send password reset email:", err);
        }
        return; // Skip other email logic
      }

      // ---------------- Other emails ----------------
      const emails: string[] = [];
      if (payload.email) emails.push(payload.email);
      if (payload.userEmail) emails.push(payload.userEmail);
      if (payload.vendorEmail) emails.push(payload.vendorEmail);

      // Auto-lookup for inventory alerts if no email
      if (
        (topic === EMAIL_TOPICS.INVENTORY_LOW ||
          topic === EMAIL_TOPICS.INVENTORY_OUT_OF_STOCK) &&
        emails.length === 0
      ) {
        emails.push(...getEmailsForInventory(payload.productId));
      }

      if (emails.length === 0) {
        console.warn(`⚠️ No recipient email found for topic ${topic}`, payload);
        return;
      }

      console.log(`📩 Event received [${topic}]`, payload);

      try {
        for (const email of emails) {
          switch (topic as EmailTopic) {
            // ---------------- USER ----------------
            case EMAIL_TOPICS.USER_REGISTERED:
              await sendEmail(
                email,
                "Welcome to E-Commerce 🎉",
                `Hi ${payload.name || "User"}, welcome to our platform!`
              );
              break;

            case EMAIL_TOPICS.USER_VERIFIED:
              await sendEmail(
                email,
                "Account Verified ✅",
                "Your account has been verified successfully."
              );
              break;

            // ---------------- ORDER ----------------
            case EMAIL_TOPICS.ORDER_CREATED:
              await sendEmail(
                email,
                "Order Placed 🛒",
                `Your order <b>${payload.orderId}</b> has been placed successfully.`
              );
              break;

            case EMAIL_TOPICS.ORDER_CANCELLED:
              await sendEmail(
                email,
                "Order Cancelled ❌",
                `Your order <b>${payload.orderId}</b> has been cancelled.`
              );
              break;

            // ---------------- PAYMENT ----------------
            case EMAIL_TOPICS.PAYMENT_SUCCESS:
              await sendEmail(
                email,
                "Payment Successful 💳",
                `Payment for order <b>${payload.orderId}</b> was successful.`
              );
              break;

            case EMAIL_TOPICS.PAYMENT_FAILED:
              await sendEmail(
                email,
                "Payment Failed ⚠️",
                `Payment for order <b>${payload.orderId}</b> failed. Please retry.`
              );
              break;

            case EMAIL_TOPICS.PAYMENT_REFUNDED:
              await sendEmail(
                email,
                "Payment Refunded 💰",
                `Your payment for order <b>${payload.orderId}</b> has been refunded.`
              );
              break;

            // ---------------- INVOICE ----------------
            case EMAIL_TOPICS.INVOICE_GENERATED:
              if (!payload.invoiceUrl) {
                console.warn("⚠️ Invoice URL missing in payload", payload);
                break;
              }

              await sendEmail(
                email,
                "Your Invoice is Ready 🧾",
                `
                <h2>Invoice Generated</h2>
                <p><b>Order ID:</b> ${payload.orderId}</p>
                <p><b>Amount:</b> ₹${payload.amount}</p>
                <p>
                  <a href="${payload.invoiceUrl}" target="_blank">📄 Download Invoice</a>
                </p>
                `
              );
              break;

            // ---------------- VENDOR ----------------
            case EMAIL_TOPICS.VENDOR_CREATED:
              await sendEmail(
                email,
                "Vendor Registration Received 🏪",
                "Your vendor account is under review."
              );
              break;

            case EMAIL_TOPICS.VENDOR_APPROVED:
              await sendEmail(
                email,
                "Vendor Approved ✅",
                "Your vendor account has been approved. You can start selling!"
              );
              break;

            case EMAIL_TOPICS.VENDOR_REJECTED:
              await sendEmail(
                email,
                "Vendor Rejected ❌",
                "Unfortunately, your vendor application was rejected."
              );
              break;

            // ---------------- INVENTORY ----------------
            case EMAIL_TOPICS.INVENTORY_LOW:
              await sendEmail(
                email,
                "Low Inventory Alert ⚠️",
                `Product <b>${payload.productId}</b> is running low. Current quantity: ${payload.quantity}, Threshold: ${payload.threshold}.`
              );
              break;

            case EMAIL_TOPICS.INVENTORY_OUT_OF_STOCK:
              await sendEmail(
                email,
                "Out of Stock 🚫",
                `Product <b>${payload.productId}</b> is now out of stock.`
              );
              break;

            // ---------------- SHIPPING ----------------
            case EMAIL_TOPICS.SHIPPING_CREATED:
              await sendEmail(
                email,
                "Shipment Created 🚚",
                `Your order <b>${payload.orderId}</b> has been shipped.`
              );
              break;

            case EMAIL_TOPICS.SHIPPING_OUT_FOR_DELIVERY:
              await sendEmail(
                email,
                "Out for Delivery 📦",
                `Your order <b>${payload.orderId}</b> is out for delivery today.`
              );
              break;

            case EMAIL_TOPICS.SHIPPING_DELIVERED:
              await sendEmail(
                email,
                "Order Delivered 🎉",
                `Your order <b>${payload.orderId}</b> has been delivered successfully.`
              );
              break;

            case EMAIL_TOPICS.SHIPPING_CANCELLED:
              await sendEmail(
                email,
                "Order Cancelled ❌",
                `Your shipment for order <b>${payload.orderId}</b> has been cancelled.`
              );
              break;

            default:
              console.warn(`⚠️ No handler for topic ${topic}`);
          }

          console.log(`✅ Email sent to ${email} for topic ${topic}`);
        }
      } catch (err) {
        console.error("🔥 Email send failed:", err);
      }
    },
  });
}

