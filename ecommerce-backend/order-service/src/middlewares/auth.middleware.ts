import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Public routes that should NOT require authentication
 */
const PUBLIC_ROUTES = ["/health"];

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Allow public routes without token
    if (PUBLIC_ROUTES.includes(req.path)) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    console.log("🔐 DECODED TOKEN:", decoded);

    // normalize user
    (req as any).user = {
      userId: (decoded as any).userId || (decoded as any).id,
      email: (decoded as any).email,
      role: (decoded as any).role,
    };

    // safety check
    if (!(req as any).user.userId) {
      return res.status(401).json({
        message: "Invalid token payload (userId missing)",
      });
    }

    next();
  } catch (err) {
    console.error("❌ Auth error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
