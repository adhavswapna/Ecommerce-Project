import { Role, Prisma } from "@prisma/client";
import prisma from "../db/prisma/prisma";
import { signToken } from "../utils/jwt";
import { hashPassword, comparePassword } from "../utils/password";
import * as authProducer from "../kafka/auth.producer";
import redis from "../redis/redis";
import axios from "axios";
import crypto from "crypto";
import { v4 as uuid } from "uuid";

export class AuthService {
  /* =====================================================
     GOOGLE AUTH URL
  ===================================================== */
  static getGoogleAuthUrl() {
    const state = crypto.randomUUID();
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
      state,
    });
    return { url: `https://accounts.google.com/o/oauth2/v2/auth?${params}`, state };
  }

  /* =====================================================
     GOOGLE CALLBACK
  ===================================================== */
  static async googleCallback(code: string) {
    try {
      const tokenRes = await axios.post(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          code,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
          grant_type: "authorization_code",
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const accessToken = tokenRes.data.access_token;

      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const { email, name, picture } = userInfo.data;

      let user = await prisma.authUser.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.authUser.create({
          data: { email, name, password: uuid(), role: "USER", isVerified: true },
        });

        if (process.env.ENABLE_KAFKA === "true") {
          await authProducer.publishUserCreated({
            id: user.id,
            name: user.name!,
            email: user.email,
            role: user.role,
          });
        }
      }

      const sessionId = uuid();
      await redis.set(
        `session:${sessionId}`,
        JSON.stringify({ userId: user.id, role: user.role, email: user.email }),
        "EX",
        7 * 24 * 60 * 60
      );

      return {
        token: signToken({ userId: user.id, role: user.role }),
        sessionId,
        user,
        avatar: picture,
      };
    } catch (err: any) {
      console.error("Google OAuth Error:", err.response?.data || err.message);
      throw new Error("Google authentication failed");
    }
  }

  /* =====================================================
     NORMAL REGISTER
  ===================================================== */
  static async register(
    name: string,
    email: string,
    password: string,
    role: Role,
    phone?: string,
    address?: string
  ) {
    try {
      const hashedPassword = await hashPassword(password);
      const user = await prisma.authUser.create({
        data: { name, email, password: hashedPassword, role, phone, address, isVerified: true },
      });

      if (process.env.ENABLE_KAFKA === "true") {
        await authProducer.publishUserCreated({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      }

      return signToken({ userId: user.id, role: user.role });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new Error("User already exists");
      }
      throw error;
    }
  }

  /* =====================================================
     LOGIN
  ===================================================== */
  static async login(email: string, password: string) {
    const user = await prisma.authUser.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return signToken({ userId: user.id, role: user.role });
  }

  /* =====================================================
     GET PROFILE
  ===================================================== */
  static async getMe(userId: string) {
    return prisma.authUser.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, phone: true, address: true, createdAt: true },
    });
  }

  /* =====================================================
     PASSWORD RESET
  ===================================================== */
  static async forgotPassword(email: string) {
  const user = await prisma.authUser.findUnique({
    where: { email },
  });

  // Do not reveal if user exists (security)
  if (!user) {
    console.log(`Password reset requested for non-existing email: ${email}`);
    return;
  }

  // Generate secure token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes

  await prisma.authUser.update({
    where: { email },
    data: {
      resetToken: hashedToken,
      resetTokenExpiry: new Date(Date.now() + TOKEN_EXPIRY),
    },
  });

  // Determine frontend URL
  const frontendUrl =
    process.env.FRONTEND_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    "http://localhost:3000";

  const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

  console.log("Generated reset URL:", resetUrl);

  /* 🔥 Send email via Kafka */
  if (process.env.ENABLE_KAFKA === "true") {
    await authProducer.publishPasswordReset({
      to: user.email,
      subject: "Password Reset Request 🔑",
      html: `
        <p>Hi ${user.name || "User"},</p>

        <p>You requested a password reset for your account.</p>

        <p>
          Click the button below to reset your password:
        </p>

        <p>
          <a href="${resetUrl}" 
             style="padding:10px 16px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">
             Reset Password
          </a>
        </p>

        <p>This link will expire in <b>15 minutes</b>.</p>

        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }

  // Only for development debugging
  if (process.env.NODE_ENV !== "production") {
    console.log("RESET TOKEN (DEV ONLY):", rawToken);
  }
}

  static async resetPassword(token: string, newPassword: string) {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await prisma.authUser.findFirst({
    where: {
      resetToken: hashedToken,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.authUser.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  console.log(`Password reset successful for user: ${user.email}`);
}
}
