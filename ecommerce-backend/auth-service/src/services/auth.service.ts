import { Role } from '@prisma/client';
import prisma from '../../db/prisma/prisma';
import { signToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';
import { publishUserCreated } from '../../kafka/auth.producer';

export class AuthService {
  static async register(
    email: string,
    password: string,
    role: Role
  ) {
    try {
      const hashedPassword = await hashPassword(password);

      const user = await prisma.authUser.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
      });

      // 🔥 Emit Kafka event (non-blocking)
      await publishUserCreated({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // ✅ Minimal JWT payload
      return signToken({
        userId: user.id,
        role: user.role,
      });
    } catch (err: any) {
      // Unique email constraint
      if (err.code === 'P2002') {
        throw new Error('Email already exists');
      }
      throw err;
    }
  }

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

  // ✅ Used by /auth/me
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
