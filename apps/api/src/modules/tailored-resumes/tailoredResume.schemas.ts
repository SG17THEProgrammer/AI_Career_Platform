import { z } from "zod";

export const generateTailoredResumeSchema =
  z.object({
    resumeId: z.string().min(1),
    atsAnalysisId: z.string().min(1),
  });

export type GenerateTailoredResumeInput =
  z.infer<
    typeof generateTailoredResumeSchema
  >;