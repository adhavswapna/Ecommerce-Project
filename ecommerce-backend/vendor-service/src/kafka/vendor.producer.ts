
import { kafka } from "./kafka.client";
import { VENDOR_TOPICS } from "./vendor.topics";

/* =====================================================
   KAFKA PRODUCER
===================================================== */

let producerInstance: any;

/**
 * Connect to Kafka only once and reuse the producer.
 */
export async function connectProducer() {
  if (!producerInstance) {
    producerInstance = kafka.producer();

    await producerInstance.connect();

    console.log(
      "✅ Vendor Kafka Producer connected"
    );
  }

  return producerInstance;
}

/* =====================================================
   GENERIC PUBLISH
===================================================== */

async function publish(
  topic: string,
  payload: any
) {
  const producer =
    await connectProducer();

  await producer.send({
    topic,

    messages: [
      {
        value: JSON.stringify(payload),
      },
    ],
  });

  console.log(
    `📤 ${topic} event published`,
    payload
  );
}

/* =====================================================
   VENDOR CREATED
===================================================== */

/**
 * Published when Vendor Service creates a vendor
 * application.
 *
 * This event can be used by other services that need
 * to know that a vendor application was created.
 */
export async function publishVendorCreated(
  payload: any
) {
  await publish(
    VENDOR_TOPICS.VENDOR_CREATED,
    payload
  );
}

/* =====================================================
   VENDOR STATUS UPDATED
===================================================== */

/**
 * Published whenever the vendor approval status
 * changes.
 *
 * Expected payload:
 *
 * {
 *   event: "VENDOR_STATUS_UPDATED",
 *   data: {
 *     vendorId: "...",
 *     userId: "...",
 *     status: "APPROVED",
 *     oldStatus: "PENDING",
 *     updatedAt: "..."
 *   }
 * }
 *
 * Auth Service consumes this event and updates:
 *
 * AuthUser.vendorStatus
 *
 * IMPORTANT:
 *
 * Vendor Service is the source of truth for vendor
 * approval status.
 */
export async function publishVendorStatusUpdated(
  payload: any
) {
  await publish(
    VENDOR_TOPICS.VENDOR_STATUS_UPDATED,
    payload
  );
}

/* =====================================================
   PRODUCT PURCHASED
===================================================== */

/**
 * Published when a vendor's product is purchased.
 */
export async function publishProductPurchased(
  payload: any
) {
  await publish(
    VENDOR_TOPICS.PRODUCT_PURCHASED,
    payload
  );
}
