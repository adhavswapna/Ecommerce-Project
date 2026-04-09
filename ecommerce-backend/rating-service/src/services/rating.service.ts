import { prisma } from '../db/prisma/prisma';
import { emitRatingCreated } from '../kafka/rating.producer';

export async function addRating(data: {
  userId: string;
  productId: string;
  rating: number;
  review?: string;
}) {
  // ✅ Validation
  if (data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  const newRating = await prisma.rating.create({
    data,
  });

  // ✅ Kafka Event (clean way)
  await emitRatingCreated({
    productId: newRating.productId,
    rating: newRating.rating,
  });

  return newRating;
}

export async function getProductRatings(productId: string) {
  return prisma.rating.findMany({
    where: {
      productId,
      isDeleted: false, // ✅ ignore deleted ratings
    },
  });
}

export async function deleteRating(id: string, userId: string) {
  const rating = await prisma.rating.findUnique({
    where: { id },
  });

  if (!rating) throw new Error('Rating not found');
  if (rating.userId !== userId) throw new Error('Unauthorized');

  // ✅ Soft delete (important)
  await prisma.rating.update({
    where: { id },
    data: { isDeleted: true },
  });

  return { message: 'Rating deleted' };
}
