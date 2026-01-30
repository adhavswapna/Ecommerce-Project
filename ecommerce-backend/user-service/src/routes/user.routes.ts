import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, UserController.me);
router.get('/:id', UserController.getById);

export default router;
