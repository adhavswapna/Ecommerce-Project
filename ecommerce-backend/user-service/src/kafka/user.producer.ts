import { getUserProducer } from "./kafka.client";
import { USER_TOPICS } from "./user.topics";

export async function publishUserRegistered(payload: { id: string; name: string; email: string }) {
  const producer = await getUserProducer();
  await producer.send({
    topic: USER_TOPICS.USER_REGISTERED,
    messages: [{ value: JSON.stringify(payload) }],
  });
  console.log("📤 user.registered event published:", payload);
}

export async function publishUserVerified(payload: { id: string; email: string }) {
  const producer = await getUserProducer();
  await producer.send({
    topic: USER_TOPICS.USER_VERIFIED,
    messages: [{ value: JSON.stringify(payload) }],
  });
  console.log("📤 user.verified event published:", payload);
}

export async function publishUserLogin(payload: { id: string; email: string }) {
  const producer = await getUserProducer();
  await producer.send({
    topic: USER_TOPICS.USER_LOGIN,
    messages: [{ value: JSON.stringify(payload) }],
  });
  console.log("📤 user.login event published:", payload);
}

export async function publishUserProfileUpdated(payload: { id: string; name: string; email: string }) {
  const producer = await getUserProducer();
  await producer.send({
    topic: USER_TOPICS.USER_PROFILE_UPDATED,
    messages: [{ value: JSON.stringify(payload) }],
  });
  console.log("📤 user.profile.updated event published:", payload);
}

export async function publishUserPasswordResetRequested(payload: { id: string; email: string }) {
  const producer = await getUserProducer();
  await producer.send({
    topic: USER_TOPICS.USER_PASSWORD_RESET_REQUESTED,
    messages: [{ value: JSON.stringify(payload) }],
  });
  console.log("📤 user.password.reset.requested event published:", payload);
}

export async function publishUserPasswordResetCompleted(payload: { id: string; email: string }) {
  const producer = await getUserProducer();
  await producer.send({
    topic: USER_TOPICS.USER_PASSWORD_RESET_COMPLETED,
    messages: [{ value: JSON.stringify(payload) }],
  });
  console.log("📤 user.password.reset.completed event published:", payload);
}

export async function publishUserDeleted(payload: { id: string; email: string }) {
  const producer = await getUserProducer();
  await producer.send({
    topic: USER_TOPICS.USER_DELETED,
    messages: [{ value: JSON.stringify(payload) }],
  });
  console.log("📤 user.deleted event published:", payload);
}

