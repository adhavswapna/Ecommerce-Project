import prisma from "../db/prisma/prisma";

export class UserService {
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

  static async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  static async updateProfile(id: string, name: string, email: string) {
    return prisma.user.update({
      where: { id },
      data: { name, email },
    });
  }

  static async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}
