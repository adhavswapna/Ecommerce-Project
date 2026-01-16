import { getProducer } from "./kafka.client";

export async function publishUserCreated(user: any) {
  const producer = await getProducer();
  if (!producer) return;

  await producer.send({
    topic: "user.created",
    messages: [
      {
        key: user.id,
        value: JSON.stringify(user),
      },
    ],
  });
}

