import { kafka } from "./kafka-client";
import { KAFKA_TOPICS } from "./topics";


export async function startSearchConsumer() {
const consumer = kafka.consumer({ groupId: "search-group" });


await consumer.connect();
await consumer.subscribe({ topic: KAFKA_TOPICS.PRODUCT_CREATED });


await consumer.run({
eachMessage: async ({ message }) => {
if (!message.value) return;
const payload = JSON.parse(message.value.toString());
console.log("📥 Search index update:", payload);
}
});
}
