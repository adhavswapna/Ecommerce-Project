import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { Role } from '../constants/role.enum';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.registerUser);

router.post(
  '/register/vendor',
  authMiddleware,
  requireRole(Role.ADMIN),
  AuthController.registerVendor
);

router.post(
  '/register/admin',
  authMiddleware,
  requireRole(Role.ADMIN),
  AuthController.registerAdmin
);

router.get('/me', authMiddleware, AuthController.me);

export default router;
