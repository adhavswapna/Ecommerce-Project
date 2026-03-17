import { getUserProducer } from "./kafka.client";
import { USER_TOPICS } from "./user.topics";

export async function publishUserProfileUpdated(payload: any) {
  const producer = await getUserProducer();

  await producer.send({
    topic: USER_TOPICS.USER_PROFILE_UPDATED,
    messages: [
      {
        value: JSON.stringify({
          event: "user.profile.updated",
          service: "user-service",
          timestamp: new Date(),
          data: payload,
        }),
      },
    ],
  });
}

export async function publishUserDeleted(payload: any) {
  const producer = await getUserProducer();

  await producer.send({
    topic: USER_TOPICS.USER_DELETED,
    messages: [
      {
        value: JSON.stringify({
          event: "user.deleted",
          service: "user-service",
          timestamp: new Date(),
          data: payload,
        }),
      },
    ],
  });
}
