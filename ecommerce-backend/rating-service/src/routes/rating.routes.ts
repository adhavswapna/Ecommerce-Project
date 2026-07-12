import { Router } from 'express';
import {
  createRating,
  getRatings,
  removeRating,
} from '../controllers/rating.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();


/* =====================================
   HEALTH CHECK
===================================== */

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: "rating-service running",
  });
});


/* =====================================
   RATING ROUTES
===================================== */

// Create rating
router.post('/', authenticate, createRating);


// Get ratings by product
router.get('/product/:productId', getRatings);


// Delete rating
router.delete('/:id', authenticate, removeRating);


export default router;
