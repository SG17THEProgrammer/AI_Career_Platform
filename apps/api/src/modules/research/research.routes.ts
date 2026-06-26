// apps/api/src/modules/research/research.routes.ts

import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware.js";

import {
  generateResearchSchema,
} from "./research.schemas.js";

import { researchService } from "./research.service.js";
import { resumesService } from "../resumes/resumes.service.js";
import { atsRepository } from "../ats/ats.repository.js";

export const researchRouter = Router();

researchRouter.use(requireAuth);

researchRouter.post(
  "/generate",
  async (req, res, next) => {
    try {
      const body =
        generateResearchSchema.parse(
          req.body
        );

      const analysis =
        await atsRepository.findById(
          req.user!.id,
          body.atsAnalysisId
        );

      if (!analysis) {
        return res.status(404).json({
          message:
            "ATS analysis not found",
        });
      }

      const resume =
        await resumesService.getResume(
          req.user!.id,
          analysis.resumeId.toString()
        );

    if (!analysis.companyName || !analysis.jobTitle) {
  return res.status(400).json({
    message:
      "ATS analysis is missing company name or job title",
  });
}

      const research =
        await researchService.generate(
          {
            userId: req.user!.id,
            atsAnalysisId:
              analysis._id.toString(),

            resumeId:
              analysis.resumeId.toString(),

            companyName:
              analysis.companyName,
            
            jobTitle:
              analysis.jobTitle,

            jobDescription:
              analysis.jobDescription,

            resumeText:
              resume.normalizedText,
          }
        );

      res.status(201).json({
        research,
      });
    } catch (error) {
      next(error);
    }
  }
);

researchRouter.get(
  "/",
  async (req, res, next) => {
    try {
      const research =
        await researchService.list(
          req.user!.id
        );

      res.json({
        research,
      });
    } catch (error) {
      next(error);
    }
  }
);

researchRouter.get(
  "/:researchId",
  async (req, res, next) => {
    try {
      const research =
        await researchService.getById(
          req.params.researchId,
          req.user!.id
        );

      res.json({
        research,
      });
    } catch (error) {
      console.log("Error" , error);
      next(error);
    }
  }
);