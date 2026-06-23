import { Router } from "express";
import { atsService } from "./ats.service.js";
import { requireAuth } from "../auth/auth.middleware.js";

export const atsRouter =
  Router();

atsRouter.post(
  "/analyze", requireAuth,
  async (req, res, next) => {
    try {
      const analysis =
        await atsService.analyze(
          req.user!.id,
          req.body.resumeId,
          req.body.jobDescription
        );

      res.status(201).json({
        analysis,
      });
    } catch (error) {
        console.log("Error" , error);
      next(error);
    }
  }
);

atsRouter.get(
  "/:analysisId", 
  requireAuth,
  async (req, res, next) => {
    try {
      const analysis =
        await atsService.getAnalysis(
          req.user!.id,
          req.params.analysisId!
        );

      res.json({
        analysis,
      });
    } catch (error) {
      next(error);
    }
  }
);