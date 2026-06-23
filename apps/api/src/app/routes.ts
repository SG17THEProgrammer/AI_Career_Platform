import type { Express } from "express";
import { authRouter } from "../modules/auth/auth.routes.js";
import { resumesRouter } from "../modules/resumes/resumes.routes.js";
import { healthRouter } from "../modules/system/health.routes.js";
import { atsRouter } from "../modules/ats/ats.routes.js";
import { tailoredResumeRouter } from "../modules/tailored-resumes/tailoredResume.routes.js";

export function registerRoutes(app: Express) {
  app.use("/health", healthRouter);
  app.use("/auth", authRouter);
  app.use("/resumes", resumesRouter);
  app.use("/ats", atsRouter);
  app.use("/tailored-resumes", tailoredResumeRouter);
}
