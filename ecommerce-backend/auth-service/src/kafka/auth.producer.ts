import { getProducer } from "./kafka.client";
import { KAFKA_TOPICS } from "./topics";

export async function publishUserCreatedEvent(user: {
  id: string;
  email: string;
  role: string;
}) {
  const producer = await getProducer();
  if (!producer) return;

  await producer.send({
    topic: KAFKA_TOPICS.AUTH_USER_CREATED,
    messages: [
      {
        key: user.id,
        value: JSON.stringify({
          event: "AUTH_USER_CREATED",
          data: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        }),
      },
    ],
  });

  console.log("📤 Kafka event sent: AUTH_USER_CREATED");
}
