import { z } from "zod";

export const analyzeJDSchema =
  z.object({
    resumeId: z.string().min(1),
    jobDescription: z.string().min(100),
  });

export type AnalyzeJDInput =
  z.infer<
    typeof analyzeJDSchema
  >;