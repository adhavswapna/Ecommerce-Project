import prisma from "../db/prisma/prisma";

export class UserService {
  /**
   * CREATE USER
   */
  static async createUser(data: {
    id: string;
    name?: string;
    email: string;
    role: "USER" | "ADMIN" | "VENDOR";
  }) {
    return prisma.user.create({
      data,
    });
  }

  /**
   * GET ALL USERS
   */
  static async getAllUsers() {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * GET USER BY ID
   */
  static async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * UPDATE USER PROFILE
   */
  static async updateProfile(
    id: string,
    name: string,
    email: string
  ) {
    return prisma.user.update({
      where: { id },
      data: {
        name,
        email,
      },
    });
  }

  /**
   * DELETE USER
   */
  static async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
