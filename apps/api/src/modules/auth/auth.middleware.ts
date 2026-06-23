import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/appError.js";
import type { AuthUser } from "./auth.types.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthUser;
  }
}

interface JwtPayload {
  sub: string;
  email: string;
  role: AuthUser["role"];
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;

  if (!token) {
    next(new AppError("Authentication required", 401, "AUTH_REQUIRED"));
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401, "INVALID_TOKEN"));
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, (error?: unknown) => {
    if (error) {
      next(error);
      return;
    }

    if (req.user?.role !== "admin") {
      next(new AppError("Admin access required", 403, "ADMIN_REQUIRED"));
      return;
    }

    next();
  });
}
