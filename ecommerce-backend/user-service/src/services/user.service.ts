import prisma from '../../db/prisma/prisma';

export class UserService {
  static getMe(userId: string) {
    return prisma.user.findUnique({ where: { id: userId } });
  }

  static getById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
}
