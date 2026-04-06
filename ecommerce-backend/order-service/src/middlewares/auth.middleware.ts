import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    console.log("🔐 DECODED TOKEN:", decoded);

    // ✅ FIX: normalize user object
    (req as any).user = {
      userId: (decoded as any).userId || (decoded as any).id,
    };

    // ✅ safety check
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
