import { Router } from 'express';
import {
  createRating,
  getRatings,
  removeRating,
} from '../controllers/rating.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, createRating);   // ✅ protect
router.get('/product/:productId', getRatings);
router.delete('/:id', authenticate, removeRating);

export default router;
