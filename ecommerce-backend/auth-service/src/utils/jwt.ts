import jwt from "jsonwebtoken";
import { Role } from "../constants/role.enum";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

/* =========================
   JWT Payload Type
========================= */
export interface JwtPayload {
  userId: string;
  role: Role;
}

/* =========================
   SIGN TOKEN
========================= */
export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* =========================
   VERIFY TOKEN
========================= */
export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET);

  // runtime safety check
  if (
    typeof decoded !== "object" ||
    !decoded ||
    !("userId" in decoded) ||
    !("role" in decoded)
  ) {
    throw new Error("Invalid token payload");
  }

  return decoded as JwtPayload;
};
