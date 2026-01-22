import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { signToken } from '../utils/jwt';
import { Role } from '../constants/role.enum';

const prisma = new PrismaClient();

export class AuthService {
  static async register(
    email: string,
    password: string,
    role: Role
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.authUser.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    // JWT stays minimal (best practice)
    return signToken({
      userId: user.id,
      role: user.role,
    });
  }

  static async login(email: string, password: string) {
    const user = await prisma.authUser.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

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

