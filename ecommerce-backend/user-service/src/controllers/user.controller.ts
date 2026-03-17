import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import {
  publishUserProfileUpdated,
  publishUserDeleted,
} from "../kafka/user.producer";

export class UserController {
  static async getById(req: Request, res: Response) {
    try {
      const user = await UserService.getById(req.params.id);

      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const user = await UserService.getById(req.user!.userId);

      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      const user = await UserService.updateProfile(id, name, email);

      await publishUserProfileUpdated({
        id: user.id,
        name: user.name!,
        email: user.email,
      });

      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await UserService.deleteUser(id);

      await publishUserDeleted({
        id: user.id,
        email: user.email,
      });

      res.json({ message: "User deleted" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
