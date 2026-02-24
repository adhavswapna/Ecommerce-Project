import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import {
  publishUserVerified,
  publishUserLogin,
  publishUserProfileUpdated,
  publishUserPasswordResetRequested,
  publishUserPasswordResetCompleted,
  publishUserDeleted,
} from "../kafka/user.producer";

export class UserController {
  // ----------------------
  // Register user
  // ----------------------
  static register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
      const user = await UserService.register({ name, email, password });
      res.status(201).json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  // ----------------------
  // Verify user
  // ----------------------
  static verify = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email } = req.body;

    await publishUserVerified({ id, email });
    res.json({ message: "User verified" });
  };

  // ----------------------
  // User login
  // ----------------------
  static login = async (req: Request, res: Response) => {
    const { id, email } = req.body;

    await publishUserLogin({ id, email });
    res.json({ message: "Login event published" });
  };

  // ----------------------
  // Update profile
  // ----------------------
  static updateProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;

    await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    await publishUserProfileUpdated({ id, name, email });
    res.json({ message: "Profile updated" });
  };

  // ----------------------
  // Password reset requested
  // ----------------------
  static passwordResetRequest = async (req: Request, res: Response) => {
    const { id, email } = req.body;
    await publishUserPasswordResetRequested({ id, email });
    res.json({ message: "Password reset requested" });
  };

  // ----------------------
  // Password reset completed
  // ----------------------
  static passwordResetComplete = async (req: Request, res: Response) => {
    const { id, email } = req.body;
    await publishUserPasswordResetCompleted({ id, email });
    res.json({ message: "Password reset completed" });
  };

  // ----------------------
  // Delete user
  // ----------------------
  static deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await prisma.user.delete({ where: { id } });
    await publishUserDeleted({ id, email: user.email });

    res.json({ message: "User deleted" });
  };

  // ----------------------
  // Get current user
  // ----------------------
  static me = async (req: Request, res: Response) => {
    const user = await UserService.getMe(req.user!.userId);
    res.json(user);
  };

  // ----------------------
  // Get user by ID
  // ----------------------
  static getById = async (req: Request, res: Response) => {
    const user = await UserService.getById(req.params.id);
    res.json(user);
  };
}

