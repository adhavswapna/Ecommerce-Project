import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * 🔐 Extend Request type
 */
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

/**
 * 🔐 JWT Payload type (supports both id & userId)
 */
interface DecodedToken extends JwtPayload {
  id?: string;
  userId?: string;
  email?: string;
  role?: string;
}

/**
 * 🔐 AUTH MIDDLEWARE
 * - Verifies JWT
 * - Supports both `id` and `userId`
 * - Attaches user to req.user
 */
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Missing Authorization header",
      });
    }

    // ❌ Invalid format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token format",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // ❌ Missing secret
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing in .env");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as DecodedToken;

    // ✅ Support BOTH id & userId
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload (missing user id)",
      });
    }

    // ✅ Attach user
    req.user = {
      id: userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err: any) {
    console.error("❌ Auth error:", err?.message || err);

    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
  }
}

/**
 * 🔐 ROLE GUARD
 * Example: requireRole("admin")
 */
export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (req.user.role !== role) {
        return res.status(403).json({
          success: false,
          message: "Forbidden - Insufficient role",
        });
      }

      next();
    } catch (err) {
      console.error("❌ Role guard error:", err);

      return res.status(500).json({
        success: false,
        message: "Role check failed",
      });
    }
  };
}
