// src/kafka/auth.producer.ts
import { Role } from "@prisma/client";
import { getProducer } from "./kafka.client";
import { KAFKA_TOPICS } from "./topics";

// ---------------- Payload Types ----------------
export interface UserCreatedPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  address?: string;
}

export interface PasswordResetPayload {
  to: string;
  subject: string;
  html: string;
}

// ---------------- Publish AUTH_USER_CREATED ----------------
export async function publishUserCreated(user: UserCreatedPayload): Promise<void> {
  const producer = await getProducer();
  if (!producer) {
    console.warn("⚠️ Kafka disabled, skipping AUTH_USER_CREATED event");
    return;
  }

  await producer.send({
    topic: KAFKA_TOPICS.AUTH_USER_CREATED,
    messages: [
      {
        key: user.id,
        value: JSON.stringify({
          event: "AUTH_USER_CREATED",
          data: user,
        }),
      },
    ],
  });

  console.log("📤 Kafka event sent: AUTH_USER_CREATED");
}

// ---------------- Publish AUTH_PASSWORD_RESET ----------------
export async function publishPasswordReset(payload: PasswordResetPayload): Promise<void> {
  const producer = await getProducer();
  if (!producer) {
    console.warn("⚠️ Kafka disabled, skipping AUTH_PASSWORD_RESET event");
    return;
  }

  // ✅ Send payload directly (no {event, data} wrapper) for email-service
  await producer.send({
    topic: KAFKA_TOPICS.AUTH_PASSWORD_RESET,
    messages: [
      {
        key: payload.to,
        value: JSON.stringify(payload),
      },
    ],
  });

  console.log(`📤 Kafka event sent: AUTH_PASSWORD_RESET to ${payload.to}`);
}

