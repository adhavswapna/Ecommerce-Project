import { producer } from './kafka.client';

export async function emitRatingCreated(data: any) {
  await producer.send({
    topic: 'rating.created',
    messages: [
      {
        value: JSON.stringify({
          event: 'RATING_CREATED',
          data,
        }),
      },
    ],
  });
}
