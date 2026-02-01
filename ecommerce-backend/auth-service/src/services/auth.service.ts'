import { Role } from '@prisma/client';
import prisma from '../db/prisma/prisma';
import { signToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import { publishUserCreated } from '../kafka/auth.producer';

export class AuthService {
  // =========================
  // REGISTER USER
  // =========================
  static async register(
    email: string,
    password: string,
    role: Role
  ) {
    try {
      // 🔐 Hash password
      const hashedPassword = await hashPassword(password);

      // 🗄️ Save to DB
      const user = await prisma.authUser.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
      });

      // 🔥 Emit Kafka event (after DB success)
      await publishUserCreated({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // 🎫 Return minimal JWT
      return signToken({
        userId: user.id,
        role: user.role,
      });
    } catch (err: any) {
      // Prisma unique constraint (email already exists)
      if (err.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw err;
    }
  }

  // =========================
  // LOGIN
  // =========================
  static async login(email: string, password: string) {
    const user = await prisma.authUser.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return signToken({
      userId: user.id,
      role: user.role,
    });
  }

  // =========================
  // GET CURRENT USER (/me)
  // =========================
  static async getMe(userId: string) {
    return prisma.authUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
}

