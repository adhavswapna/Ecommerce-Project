// src/types/user.ts


export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  VENDOR = "VENDOR",
}


export interface User {

  id: string;

  name: string;

  email: string;

  role: UserRole;

  phone: string | null;

  address: string | null;

  avatar?: string | null;

  isActive?: boolean;

  createdAt?: string;

  updatedAt?: string;

}


export interface JwtUserPayload {

  userId: string;

  email: string;

  name: string;

  role: UserRole;

  iat?: number;

  exp?: number;

}


export interface LoginRequest {

  email: string;

  password: string;

}


export interface LoginResponse {

  token: string;

  user?: User;

}


export interface RegisterRequest {

  name: string;

  email: string;

  password: string;

  phone?: string;

  address?: string;

}


export interface UpdateUserRequest {

  name?: string;

  phone?: string | null;

  address?: string | null;

  avatar?: string | null;

}


export interface UserProfileResponse {

  id: string;

  name: string;

  email: string;

  role: UserRole;

  phone: string | null;

  address: string | null;

  createdAt: string;

}


export interface AuthState {

  user: User | null;

  token: string | null;

  isAuthenticated: boolean;

  loading: boolean;

}


export interface ApiUserResponse {

  success?: boolean;

  message?: string;

  data?: User;

}



/* =========================================
   JWT HELPERS
========================================= */

export const decodeJwtUser = (
  token: string | null
): JwtUserPayload | null => {
  try {
    if (!token) return null;

    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return payload as JwtUserPayload;
  } catch {
    return null;
  }
};
