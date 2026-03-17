import { getUserConsumer } from "./kafka.client";
import { USER_TOPICS } from "./user.topics";
import { UserService } from "../services/user.service";

export async function startUserConsumer() {
  const consumer = await getUserConsumer();

  await consumer.subscribe({
    topic: USER_TOPICS.AUTH_USER_CREATED,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      const user = payload.data;

      await UserService.createUser({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      console.log("👤 User created:", user.email);
    },
  });
}
