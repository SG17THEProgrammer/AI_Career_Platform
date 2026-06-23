import { Types } from "mongoose";

export type UserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface DbUser {
  email: string;
  role: UserRole;
  passwordHash: string;
  lastUsedResumeId?: Types.ObjectId | null;
}

export interface AuthResult {
  user: AuthUser;
  accessToken: string;
}
