import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import {
  publishUserProfileUpdated,
  publishUserDeleted,
} from "../kafka/user.producer";

export class UserController {
  /**
   * 🔥 CREATE USER
   */
  static async createUser(req: Request, res: Response) {
    try {
      const { id, name, email, role } = req.body;

      const user = await UserService.createUser({
        id,
        name,
        email,
        role,
      });

      return res.status(201).json(user);
    } catch (err: any) {
      console.error("❌ createUser error:", err);

      return res.status(500).json({
        error: err.message,
      });
    }
  }

  /**
   * 👥 GET ALL USERS
   */
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();

      return res.status(200).json({
        data: users,
      });
    } catch (err: any) {
      console.error("❌ getAllUsers error:", err);

      return res.status(500).json({
        error: err.message,
      });
    }
  }

  /**
   * GET USER BY ID
   */
  static async getById(req: Request, res: Response) {
    try {
      const user = await UserService.getById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.json(user);
    } catch (err: any) {
      console.error("❌ getById error:", err);

      return res.status(500).json({
        error: err.message,
      });
    }
  }

  /**
   * CURRENT LOGGED-IN USER
   */
  static async getMe(req: Request, res: Response) {
    try {
      const user = await UserService.getById(req.user!.userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.json(user);
    } catch (err: any) {
      console.error("❌ getMe error:", err);

      return res.status(500).json({
        error: err.message,
      });
    }
  }

  /**
   * UPDATE PROFILE
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const user = await UserService.updateProfile(
        id,
        name,
        email
      );

      await publishUserProfileUpdated({
        id: user.id,
        name: user.name!,
        email: user.email,
      });

      return res.json(user);
    } catch (err: any) {
      console.error("❌ updateProfile error:", err);

      return res.status(500).json({
        error: err.message,
      });
    }
  }

  /**
   * DELETE USER
   */
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await UserService.deleteUser(id);

      await publishUserDeleted({
        id: user.id,
        email: user.email,
      });

      return res.json({
        message: "User deleted",
      });
    } catch (err: any) {
      console.error("❌ deleteUser error:", err);

      return res.status(500).json({
        error: err.message,
      });
    }
  }
}
