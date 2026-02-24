export interface CreateAuthDTO {
  email: string;
  password: string;
  role?: "USER" | "VENDOR" | "ADMIN";
}
