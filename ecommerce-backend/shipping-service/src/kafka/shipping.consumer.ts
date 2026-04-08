import { getKafka } from "./kafka.client";
import axios from "axios";
import { createShipment } from "../services/shipping.service";
import { emitShippingCreated } from "./shipping.producer";

/* -------------------------------------------------------------------------- */
/*                          ORDER SERVICE HTTP CALLS                          */
/* -------------------------------------------------------------------------- */

const ORDER_SERVICE =
  process.env.ORDER_SERVICE_URL || "http://localhost:3006";

async function getOrder(orderId: string) {
  const res = await axios.get(`${ORDER_SERVICE}/orders/${orderId}`);
  return res.data;
}

async function updateOrderStatus(orderId: string, status: string) {
  await axios.patch(
    `${ORDER_SERVICE}/orders/${orderId}/status`,
    { status }
  );
}

/* -------------------------------------------------------------------------- */
/*                         SHIPPING KAFKA CONSUMER                            */
/* -------------------------------------------------------------------------- */

export async function startShippingConsumer() {
  const kafka = getKafka();

  const consumer = kafka.consumer({
    groupId: "shipping-group",
  });

  await consumer.connect();

  await consumer.subscribe({
    topic: "payment.success",
    fromBeginning: false,
  });

  console.log("🚚 Shipping consumer started...");

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        if (!message.value) return;

        const event = JSON.parse(message.value.toString());

        const { orderId, userId } = event;

        console.log("📦 Payment success received:", event);

        /* ----------------------- 1. FETCH ORDER DETAILS ---------------------- */

        let order;

        try {
          order = await getOrder(orderId);
        } catch (err) {
          throw new Error("Order service unavailable");
        }

        if (!order?.address) {
          throw new Error(`Shipping address not found for order ${orderId}`);
        }

        const address = order.address;

        /* ----------------------- 2. CREATE SHIPMENT -------------------------- */

        const trackingId = `TRK-${Date.now()}-${orderId.slice(0, 6)}`;

        const shipment = await createShipment({
          orderId,
          userId,
          address,
          trackingId,
        });

        console.log("🚚 Shipment created:", shipment.id);

        /* ----------------------- 3. EMIT SHIPPING EVENT ---------------------- */

        await emitShippingCreated({
          orderId,
          userId,
          shipmentId: shipment.id,
          trackingId,
          address,
        });

        console.log("📤 shipping.created emitted");

        /* ----------------------- 4. UPDATE ORDER STATUS ---------------------- */

        await updateOrderStatus(orderId, "SHIPPED");

        console.log("✅ Order status updated → SHIPPED");
      } catch (err) {
        console.error("❌ Shipping consumer error:", err);
      }
    },
  });
}
