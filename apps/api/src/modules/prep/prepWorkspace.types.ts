import { Types } from "mongoose";

export type OwnerType = "user" | "admin" | "system";

export type PrepWorkspaceStatus =
  | "CREATED"
  | "QUESTIONS_GENERATED"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface PreparationProgress {
  totalQuestions: number;
  completedQuestions: number;
  accuracy: number | null;
}

export interface PrepWorkspaceMetadata {
  generatedAt: Date;
  generationVersion: string;
  jobDescriptionHash: string;
}

export interface PrepWorkspace {
  _id: Types.ObjectId;

  userId: Types.ObjectId;
  ownerType: OwnerType;

  atsAnalysisId: Types.ObjectId;

  resumeId: Types.ObjectId;
  tailoredResumeId?: Types.ObjectId;
  researchDocumentId: Types.ObjectId;

  companyName: string;
  jobTitle: string;

  workspaceHash: string;

  status: PrepWorkspaceStatus;

  preparationProgress: PreparationProgress;

  metadata: PrepWorkspaceMetadata;

  isDeleted: boolean;
  deletedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}