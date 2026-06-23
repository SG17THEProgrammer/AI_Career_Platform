import { Router } from "express";
import { requireAuth }
  from "../auth/auth.middleware.js";
import {
  tailoredResumeService,
} from "./tailoredResume.service.js";

export const tailoredResumeRouter =
  Router();

tailoredResumeRouter.use(
  requireAuth
);

tailoredResumeRouter.post(
  "/generate",
  async (req, res, next) => {
    try {
      const result =
        await tailoredResumeService
          .generate(
            req.user!.id,
            req.body.resumeId,
            req.body.atsAnalysisId
          );

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

tailoredResumeRouter.get(
  "/",
  async (req, res, next) => {
    try {
      const result =
        await tailoredResumeService
          .list(
            req.user!.id
          );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

tailoredResumeRouter.get(
  "/:id",
  async (req, res, next) => {
    try {
      const result =
        await tailoredResumeService
          .get(
            req.user!.id,
            req.params.id
          );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);