import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    console.log('AUTH HEADER:', authHeader);

    // Check header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header missing',
      });
    }

    // Validate Bearer format
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization format',
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    console.log('EXTRACTED TOKEN:', token);

    // Validate token exists
    if (!token || token === 'undefined') {
      return res.status(401).json({
        success: false,
        message: 'Token missing',
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as any;

    console.log('DECODED USER:', decoded);

    // Attach user to request
    (req as any).user = decoded;

    next();
  } catch (err) {
    console.log('JWT ERROR:', err);

    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
}
