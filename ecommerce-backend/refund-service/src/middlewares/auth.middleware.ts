import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("🔥 AUTH MIDDLEWARE HIT");

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const secret = process.env.JWT_SECRET;

    // ✅ HARD CHECK (fix TS error)
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in .env");
    }

    const decoded = jwt.verify(token, secret);

    (req as any).user = decoded;

    next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    return res.status(401).json({
      message: "Unauthorized (invalid token or secret mismatch)",
    });
  }
};
