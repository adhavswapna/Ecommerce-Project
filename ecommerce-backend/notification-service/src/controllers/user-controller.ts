import { Request, Response } from "express";
import { createUser } from "../services/user.service";

export async function register(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const user = await createUser(email);
  res.status(201).json(user);
}
