
import { Kafka, Consumer } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

/* =====================================================
   KAFKA CONFIGURATION
===================================================== */

const kafka = new Kafka({
  clientId:
    process.env.SERVICE_NAME ||
    "auth-service",

  brokers: [
    process.env.KAFKA_BROKER ||
    "localhost:9092",
  ],
});

let consumer: Consumer | null = null;

/* =====================================================
   AUTH KAFKA CONSUMER
===================================================== */

/**
 * Connect Auth Service Kafka consumer.
 *
 * IMPORTANT:
 *
 * Vendor authentication accounts are NO LONGER created
 * from a vendor approval event.
 *
 * New workflow:
 *
 * Vendor registers
 *      ↓
 * Auth Service creates AuthUser
 *      ↓
 * AuthUser.vendorStatus = PENDING
 *      ↓
 * Vendor Service manages approval
 *      ↓
 * Vendor Service publishes vendor.status.updated
 *      ↓
 * Auth Service vendor.consumer.ts updates
 * AuthUser.vendorStatus
 *
 * Therefore this consumer must NOT listen to:
 *
 * vendor.approved
 *
 * and must NOT call:
 *
 * AuthService.createVendorInvitation()
 */
export async function connectConsumer() {
  if (process.env.ENABLE_KAFKA !== "true") {
    console.log(
      "⚠️ Kafka disabled, auth consumer not started"
    );

    return;
  }

  if (consumer) {
    return consumer;
  }

  consumer = kafka.consumer({
    groupId: "auth-service-group",
  });

  await consumer.connect();

  console.log(
    "✅ Auth Kafka Consumer connected"
  );

  /*
   * No vendor.approved subscription here.
   *
   * Vendor approval events are handled by:
   *
   * src/kafka/vendor.consumer.ts
   *
   * which listens to:
   *
   * vendor.status.updated
   */

  console.log(
    "ℹ️ Auth consumer connected. No obsolete vendor.approved subscription."
  );

  /*
   * This consumer currently has no subscriptions.
   *
   * Keep the function because the Auth Service may use
   * this consumer for future Auth-related Kafka events.
   */
  await consumer.run({
    eachMessage: async ({
      topic,
      partition,
      message,
    }) => {
      try {
        if (!message.value) {
          return;
        }

        const rawMessage =
          message.value.toString();

        console.log(
          "📥 Auth Kafka message:",
          {
            topic,
            partition,
            message: rawMessage,
          }
        );

      } catch (error) {
        console.error(
          "❌ Auth Kafka Consumer Error:",
          error
        );

        /*
         * Do not crash the Auth Service because
         * one Kafka message failed.
         */
      }
    },
  });

  return consumer;
}

