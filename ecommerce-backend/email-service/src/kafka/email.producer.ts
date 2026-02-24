// src/kafka/email.producer.ts
import { getProducer } from "./kafka.client";
import { EMAIL_TOPICS, type EmailTopic } from "./email.topics";

export interface EmailEventPayload {
  topic: EmailTopic;
  data: {
    to: string;       // recipient email
    subject: string;  // email subject
    html: string;     // email HTML content
  };
}

/**
 * Publish a generic email event to Kafka
 */
export async function publishEmailEvent(payload: EmailEventPayload): Promise<void> {
  const producer = await getProducer();

  // Kafka disabled → safe exit
  if (!producer) {
    console.warn(`⚠️ Kafka disabled, skipping email event for topic ${payload.topic}`);
    return;
  }

  await producer.send({
    topic: payload.topic,
    messages: [
      {
        key: payload.data.to,
        value: JSON.stringify(payload.data),
      },
    ],
  });

  console.log(`📤 Kafka email event sent for topic ${payload.topic} to ${payload.data.to}`);
}

