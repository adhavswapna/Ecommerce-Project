import { consumer } from "./kafka.client";
import { NOTIFICATION_TOPICS } from "./notification.topics";
import { sendToUser } from "../websocket/websocket";

export const startKafkaConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topics: Object.values(NOTIFICATION_TOPICS),
  });

  console.log("📡 Kafka Consumer Connected");

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const data = JSON.parse(message.value?.toString() || "{}");

        if (!data.userId) return;

        console.log(`📩 Event received: ${topic}`, data);

        let notification = {
          userId: data.userId,
          type: "GENERAL",
          message: "New notification",
        };

        switch (topic) {
          case NOTIFICATION_TOPICS.CART_ITEM_ADDED:
            notification = {
              userId: data.userId,
              type: "CART",
              message: "Item added to cart 🛒",
            };
            break;

          case NOTIFICATION_TOPICS.CART_ITEM_REMOVED:
            notification = {
              userId: data.userId,
              type: "CART",
              message: "Item removed from cart ❌",
            };
            break;

          case NOTIFICATION_TOPICS.ORDER_CREATED:
            notification = {
              userId: data.userId,
              type: "ORDER",
              message: "Order placed successfully ✅",
            };
            break;

          case NOTIFICATION_TOPICS.ORDER_SHIPPED:
            notification = {
              userId: data.userId,
              type: "ORDER",
              message: "Your order is shipped 🚚",
            };
            break;

          case NOTIFICATION_TOPICS.ORDER_DELIVERED:
            notification = {
              userId: data.userId,
              type: "ORDER",
              message: "Order delivered 🎉",
            };
            break;

          case NOTIFICATION_TOPICS.PAYMENT_SUCCESS:
            notification = {
              userId: data.userId,
              type: "PAYMENT",
              message: "Payment successful 💳",
            };
            break;

          case NOTIFICATION_TOPICS.PAYMENT_FAILED:
            notification = {
              userId: data.userId,
              type: "PAYMENT",
              message: "Payment failed ❌",
            };
            break;

          case NOTIFICATION_TOPICS.RETURN_REQUESTED:
            notification = {
              userId: data.userId,
              type: "RETURN",
              message: "Return requested 🔁",
            };
            break;
        }

        // safe send
        sendToUser(notification.userId, notification);
      } catch (err) {
        console.error("❌ Kafka message processing failed:", err);
      }
    },
  });
};
