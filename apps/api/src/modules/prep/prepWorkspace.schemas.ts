import { z } from "zod";

export const createPrepWorkspaceSchema = z.object({
  atsAnalysisId: z.string().min(1),
});

export const updatePrepWorkspaceStatusSchema =
  z.object({
    status: z.enum([
      "CREATED",
      "QUESTIONS_GENERATED",
      "IN_PROGRESS",
      "COMPLETED",
    ]),
  });

export const updatePrepWorkspaceProgressSchema =
  z.object({
    totalQuestions:
      z.number().int().nonnegative().optional(),

    completedQuestions:
      z.number().int().nonnegative().optional(),

    accuracy:
      z.number().min(0).max(100).nullable().optional(),
  });

export type CreatePrepWorkspaceInput =
  z.infer<typeof createPrepWorkspaceSchema>;

export type UpdatePrepWorkspaceStatusInput =
  z.infer<typeof updatePrepWorkspaceStatusSchema>;

export type UpdatePrepWorkspaceProgressInput =
  z.infer<typeof updatePrepWorkspaceProgressSchema>;