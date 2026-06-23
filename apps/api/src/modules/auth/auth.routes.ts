import { Router } from "express";
import { authService } from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import { requireAuth } from "./auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const result = await authService.register(registerSchema.parse(req.body));
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const result = await authService.login(loginSchema.parse(req.body));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

authRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const result = await authService.getMe(req.user!);
    res.json(result);
  } catch (error) { 
    next(error);
  }
});