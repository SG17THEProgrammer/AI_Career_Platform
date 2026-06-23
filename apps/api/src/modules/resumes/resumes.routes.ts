import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { requireAuth } from "../auth/auth.middleware.js";
import { resumesService } from "./resumes.service.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  }
});

const uploadBodySchema = z.object({
  displayName: z.string().trim().min(1).max(120).optional()
});

export const resumesRouter = Router();

resumesRouter.use(requireAuth);

resumesRouter.post("/", upload.single("resume"), async (req, res, next) => {
  try {
    // console.log("body:", req.body);
    // console.log("file:", req.file);
    // console.log("user:", req.user);    
    const body = uploadBodySchema.parse(req.body);
    const resume = await resumesService.uploadResume(req.user!.id, req.file, body.displayName);
    res.status(201).json({ resume });
  } catch (error) {
    console.error("🔥 RESUME ROUTE ERROR:", error);
    next(error);
  }
});

resumesRouter.get("/", async (req, res, next) => {
  try {
    const resumes = await resumesService.listResumes(req.user!.id);
    res.json({ resumes });
  } catch (error) {
    next(error);
  }
});

resumesRouter.get("/:resumeId", async (req, res, next) => {
  try {
    const resume = await resumesService.getResume(req.user!.id, req.params.resumeId);
    res.json({ resume });
  } catch (error) {
    next(error);
  }
});

// resumesRouter.patch("/:resumeId/last-used", async (req, res, next) => {
//   try {
//     const resume = await resumesService.markLastUsed(req.user!.id, req.params.resumeId);
//     res.json({ resume });
//   } catch (error) {
//     next(error);
//   }
// });

resumesRouter.post(
  "/:resumeId/select",
  async (req, res, next) => {
    try {
      const resume =
        await resumesService.selectResume(
          req.user!.id,
          req.params.resumeId
        );

      res.json({
        resume
      });
    } catch (error) {
      next(error);
    }
  }
);

resumesRouter.delete("/:resumeId", async (req, res, next) => {
  try {
    await resumesService.deleteResume(req.user!.id, req.params.resumeId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
