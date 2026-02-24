import { z } from 'zod';

export const createRatingSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export type CreateRatingDTO = z.infer<typeof createRatingSchema>;

