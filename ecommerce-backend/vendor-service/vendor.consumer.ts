import { kafka } from "./kafka.client";
import { VENDOR_TOPICS } from "./vendor.topics";
import { VendorEvent } from "./vendor.events";

const consumer = kafka.consumer({
  groupId: "vendor-service-group",
});

/* ---------- SAFE JSON PARSER ---------- */
function safeParse(value: Buffer | null): VendorEvent | null {
  if (!value) return null;

  try {
    return JSON.parse(value.toString());
  } catch {
    console.error("❌ Invalid JSON message:");
    console.error(value.toString());
    return null;
  }
}

export const connectConsumer = async () => {
  await consumer.connect();
  console.log("✅ Vendor Kafka Consumer connected");

  await consumer.subscribe({
    topic: VENDOR_TOPICS.VENDOR_CREATED,
    fromBeginning: true,
  });

  await consumer.subscribe({
    topic: VENDOR_TOPICS.VENDOR_STATUS_UPDATED,
    fromBeginning: true,
  });

  await consumer.subscribe({
    topic: VENDOR_TOPICS.PRODUCT_PURCHASED,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const payload = safeParse(message.value);
      if (!payload) return;

      console.log(`📥 ${topic} received`, payload);

      // ✅ NO EMAIL HERE
      // Only analytics / logs / projections if needed
      switch (topic) {
        case VENDOR_TOPICS.VENDOR_CREATED:
          console.log(`🏪 Vendor created: ${payload.vendorId}`);
          break;

        case VENDOR_TOPICS.VENDOR_STATUS_UPDATED:
          console.log(`🔄 Vendor status updated: ${payload.vendorId}`);
          break;

        case VENDOR_TOPICS.PRODUCT_PURCHASED:
          console.log(`🛒 Product purchased for vendor ${payload.vendorId}`);
          break;
      }
    },
  });
};

