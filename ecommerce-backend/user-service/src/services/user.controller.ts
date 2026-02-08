import { Request, Response } from "express";
import prisma from "../db/prisma/prisma";
import { UserService } from "../services/user.service";
import {
  publishUserRegistered,
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
    try {
      const { name, email, password } = req.body;
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
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    await publishUserVerified({ id: user.id, email: user.email });
    res.json({ message: "User verified", id: user.id, email: user.email });
  };

  // ----------------------
  // User login
  // ----------------------
  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await UserService.verifyPassword(email, password);
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    await publishUserLogin({ id: user.id, email: user.email });
    res.json({ message: "Login event published", user });
  };

  // ----------------------
  // Update profile
  // ----------------------
  static updateProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    await publishUserProfileUpdated({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email });
    const { password, ...safeUser } = updatedUser;
    res.json({ message: "Profile updated", user: safeUser });
  };

  // ----------------------
  // Password reset requested
  // ----------------------
  static passwordResetRequest = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    await publishUserPasswordResetRequested({ id: user.id, email: user.email });
    res.json({ message: "Password reset requested", id: user.id });
  };

  // ----------------------
  // Password reset completed
  // ----------------------
  static passwordResetComplete = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    await publishUserPasswordResetCompleted({ id: user.id, email: user.email });
    res.json({ message: "Password reset completed", id: user.id });
  };

  // ----------------------
  // Delete user
  // ----------------------
  static deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await prisma.user.delete({ where: { id } });
    await publishUserDeleted({ id: user.id, email: user.email });
    res.json({ message: "User deleted", id: user.id });
  };
}

