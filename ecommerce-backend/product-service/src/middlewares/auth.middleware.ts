import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

export interface AuthenticatedUser {
  userId: string;
  role: string;
}

export interface AuthenticatedRequest
  extends Request {
  user?: AuthenticatedUser;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      success: false,
      message: "Token missing",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token missing",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AuthenticatedUser;

    if (
      !decoded ||
      !decoded.userId ||
      !decoded.role
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("JWT verification error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
