import prisma from "../db/prisma/prisma";
import { publishUserRegistered } from "../kafka/user.producer";
import bcrypt from "bcrypt";

export class UserService {
  // ----------------------
  // Register user (returns existing user if already registered)
  // ----------------------
  static async register(data: { name: string; email: string; password: string }) {
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } });

    if (existing) {
      // Return existing user without password
      const { password, ...safeUser } = existing;
      return safeUser;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    // Publish Kafka event for new users
    await publishUserRegistered({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    // Remove password before returning
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // ----------------------
  // Get user by ID
  // ----------------------
  static async getById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // ----------------------
  // Get current user (password hidden)
  // ----------------------
  static async getMe(userId: string) {
    return this.getById(userId);
  }

  // ----------------------
  // Verify password for login
  // ----------------------
  static async verifyPassword(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}

