// research.schemas.ts

import { z } from "zod";

export const generateResearchSchema =
  z.object({
    atsAnalysisId: z
      .string()
      .trim()
      .min(1),
  });

export type GenerateResearchInput =
  z.infer<
    typeof generateResearchSchema
  >;