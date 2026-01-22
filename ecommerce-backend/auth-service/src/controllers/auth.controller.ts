import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { Role } from '../constants/role.enum';

export class AuthController {
  static registerUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await AuthService.register(email, password, Role.USER);
    res.json({ token });
  };

  static registerVendor = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await AuthService.register(email, password, Role.VENDOR);
    res.json({ token });
  };

  static registerAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await AuthService.register(email, password, Role.ADMIN);
    res.json({ token });
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await AuthService.login(email, password);
    res.json({ token });
  };

  // ✅ FIXED: fetch user from DB (not JWT)
  static me = async (req: any, res: Response) => {
    const user = await AuthService.getMe(req.user.userId);
    res.json(user);
  };
}
