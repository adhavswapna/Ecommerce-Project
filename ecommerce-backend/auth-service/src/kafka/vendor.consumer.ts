
import { Consumer } from "kafkajs";
import { createConsumer } from "./kafka.client";
import { AuthService } from "../services/auth.service";

const consumer: Consumer = createConsumer(
  "auth-service-vendor-group"
);

/* =====================================================
   CONNECT VENDOR APPROVAL CONSUMER
===================================================== */

/**
 * Auth Service listens for vendor status changes.
 *
 * New vendor workflow:
 *
 * Vendor registers
 *      ↓
 * Auth Service creates AuthUser
 *      ↓
 * AuthUser.vendorStatus = PENDING
 *      ↓
 * Vendor Service creates Vendor(PENDING)
 *      ↓
 * Admin approves/rejects vendor
 *      ↓
 * Vendor Service publishes:
 *
 * vendor.status.updated
 *
 *      ↓
 * Auth Service receives event
 *      ↓
 * AuthUser.vendorStatus is updated
 *
 * IMPORTANT:
 *
 * Auth Service does NOT create the AuthUser here.
 * The AuthUser already exists from vendor registration.
 */
export async function connectVendorConsumer() {
  try {
    if (process.env.ENABLE_KAFKA !== "true") {
      console.log(
        "⚠️ Kafka disabled. Vendor consumer will not start."
      );

      return;
    }

    await consumer.connect();

    console.log(
      "✅ Auth Service Vendor Kafka Consumer connected"
    );

    /* =====================================================
       SUBSCRIBE TO VENDOR STATUS EVENTS
    ===================================================== */

    await consumer.subscribe({
      topic: "vendor.status.updated",
      fromBeginning: false,
    });

    console.log(
      "👂 Listening for vendor.status.updated events..."
    );

    /* =====================================================
       PROCESS VENDOR STATUS EVENTS
    ===================================================== */

    await consumer.run({
      eachMessage: async ({
        message,
      }) => {
        try {
          if (!message.value) {
            return;
          }

          const rawMessage =
            message.value.toString();

          console.log(
            "📥 Auth Service received vendor status event:",
            rawMessage
          );

          const payload =
            JSON.parse(rawMessage);

          /*
           * Vendor Service may publish either:
           *
           * {
           *   event: "VENDOR_STATUS_UPDATED",
           *   data: {
           *     vendorId: "...",
           *     userId: "...",
           *     status: "APPROVED"
           *   }
           * }
           *
           * or:
           *
           * {
           *   vendorId: "...",
           *   userId: "...",
           *   status: "APPROVED"
           * }
           *
           * Support both formats.
           */

          const eventData =
            payload?.data ?? payload;

          const {
            vendorId,
            userId,
            id,
            status,
          } = eventData;

          /*
           * vendorId is useful for logging.
           *
           * userId is the AuthUser.id.
           *
           * Some existing events may still use
           * "id" for the vendor ID, so we accept
           * both for compatibility.
           */

          const resolvedVendorId =
            vendorId ?? id;

          if (!resolvedVendorId || !status) {
            console.error(
              "❌ Invalid vendor status event. Missing vendorId/id or status:",
              eventData
            );

            return;
          }

          /*
           * The Auth Service needs the AuthUser ID
           * in order to update AuthUser.vendorStatus.
           */

          if (!userId) {
            console.error(
              "❌ Invalid vendor status event. Missing userId:",
              eventData
            );

            return;
          }

          const normalizedStatus =
            String(status).toUpperCase();

          if (
            normalizedStatus !== "PENDING" &&
            normalizedStatus !== "APPROVED" &&
            normalizedStatus !== "REJECTED"
          ) {
            console.error(
              `❌ Invalid vendor status "${status}" for vendor ${resolvedVendorId}`
            );

            return;
          }

          console.log(
            "🔄 Updating AuthUser vendor status...",
            {
              vendorId: resolvedVendorId,
              userId,
              status: normalizedStatus,
            }
          );

          /*
           * Auth Service updates only its own database.
           *
           * Vendor Service remains the source of truth
           * for the vendor approval lifecycle.
           */

          const result =
            await AuthService.updateVendorStatus(
              userId,
              normalizedStatus
            );

          console.log(
            "✅ AuthUser vendor status updated",
            {
              vendorId: resolvedVendorId,
              userId: result.id,
              status: result.vendorStatus,
            }
          );

        } catch (error) {
          console.error(
            "❌ Error processing vendor status event:",
            error
          );
        }
      },
    });

  } catch (error) {
    console.error(
      "❌ Auth Vendor Kafka Consumer failed:",
      error
    );

    throw error;
  }
}

