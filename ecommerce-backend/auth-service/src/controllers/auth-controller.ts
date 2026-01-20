import { Request, Response } from "express";
import * as authService from "../services/auth-service";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const user = await authService.register(email, password, role);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
