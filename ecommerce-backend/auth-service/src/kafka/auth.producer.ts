import { Role } from "@prisma/client";
import { getProducer } from "./kafka.client";
import { KAFKA_TOPICS } from "./topics";

/* =====================================================
   PAYLOAD TYPES
===================================================== */

/**
 * Published whenever Auth Service creates an AuthUser.
 *
 * This includes:
 * - CUSTOMER
 * - VENDOR
 * - ADMIN
 *
 * For vendors, this event is published immediately
 * during vendor self-registration, before admin approval.
 */
export interface UserCreatedPayload {
  id: string;
  name?: string;
  email: string;
  role: Role;
  phone?: string;
  address?: string;
}

/**
 * Password reset / password-related notification.
 */
export interface PasswordResetPayload {
  to: string;
  subject: string;
  html: string;
}

/* =====================================================
   AUTH USER CREATED
===================================================== */

/**
 * Publish AuthUser creation event.
 *
 * Flow:
 *
 * Vendor
 *   ↓
 * POST /auth/register/vendor
 *   ↓
 * Auth Service creates AuthUser
 *   ↓
 * AUTH_USER_CREATED
 *   ├── User Service creates User
 *   └── Vendor Service creates Vendor(PENDING)
 */
export async function publishUserCreated(
  user: UserCreatedPayload
): Promise<void> {
  const producer = await getProducer();

  if (!producer) {
    console.warn(
      "⚠️ Kafka disabled, skipping AUTH_USER_CREATED event"
    );

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

  console.log(
    "📤 Kafka event sent: AUTH_USER_CREATED",
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    }
  );
}

/* =====================================================
   PASSWORD RESET
===================================================== */

/**
 * Publish password reset notification.
 *
 * This remains separate from vendor registration.
 */
export async function publishPasswordReset(
  payload: PasswordResetPayload
): Promise<void> {
  const producer = await getProducer();

  if (!producer) {
    console.warn(
      "⚠️ Kafka disabled, skipping AUTH_PASSWORD_RESET event"
    );

    return;
  }

  await producer.send({
    topic: KAFKA_TOPICS.AUTH_PASSWORD_RESET,

    messages: [
      {
        key: payload.to,

        value: JSON.stringify(payload),
      },
    ],
  });

  console.log(
    `📤 Kafka event sent: AUTH_PASSWORD_RESET to ${payload.to}`
  );
}

