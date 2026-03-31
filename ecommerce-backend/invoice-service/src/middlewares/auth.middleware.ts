import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 🔐 Extend Request type
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

/**
 * 🔐 AUTH MIDDLEWARE
 * - Verifies JWT
 * - Attaches user to req.user
 */
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // ❌ No secret
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing in .env");
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
      email: string;
      role?: string;
    };

    // Attach user
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("❌ Auth error:", err);

    return res.status(401).json({
      message: "Unauthorized - Invalid token",
    });
  }
}

/**
 * 🔐 OPTIONAL ROLE GUARD
 * Example: requireRole("admin")
 */
export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}
