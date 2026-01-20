import prisma from "../../db/prisma/client";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { Role } from "@prisma/client";

export const register = async (
  email: string,
  password: string,
  role: Role = Role.USER
) => {
  const existing = await prisma.authUser.findUnique({ // FIXED
    where: { email },
  });

  if (existing) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.authUser.create({ // FIXED
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.authUser.findUnique({ // FIXED
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};
