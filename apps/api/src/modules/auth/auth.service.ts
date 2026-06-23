import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env, typedEnv } from "../../config/env.js";
import { AppError } from "../../shared/errors/appError.js";
import type { AuthResult, AuthUser, DbUser , UserRole} from "./auth.types.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";
import { User } from './auth.model.js';


export class AuthService {
  async register(input: RegisterInput): Promise<AuthResult> {
    const email = input.email.toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError(
        "Email is already registered",
        409,
        "EMAIL_ALREADY_REGISTERED"
      );
    }

    const dbUser: DbUser = {
      email,
      role: "user",
      passwordHash: await bcrypt.hash(input.password, 12),
    };

    const user = await User.create(dbUser);

    const authUser: AuthUser = {
      id: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    };

    return this.toAuthResult(authUser);
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const email = input.email.toLowerCase();
    const user = await User.findOne({email});

    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    return this.toAuthResult({
    id: user._id.toString(),
    email: user.email,
    role: user.role as UserRole,
  });
  }

async getMe(user: AuthUser): Promise<AuthResult> {
  const dbUser = await User.findById(user.id);

  if (!dbUser) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return this.toAuthResult({
    id: dbUser._id.toString(),
    email: dbUser.email,
    role: dbUser.role as UserRole,
  });
}

  private toAuthResult(user: AuthUser): AuthResult {
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      accessToken: jwt.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role
        },
        env.JWT_SECRET,
        { expiresIn: typedEnv.JWT_EXPIRES_IN }
      )
    };
  }
}

export const authService = new AuthService();
