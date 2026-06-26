import { Schema, model } from "mongoose";
import {
  PrepWorkspace,
  PrepWorkspaceStatus,
} from "./prepWorkspace.types.js";

const preparationProgressSchema = new Schema(
  {
    totalQuestions: {
      type: Number,
      default: 0,
    },
    completedQuestions: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: null,
    },
  },
  {
    _id: false,
  }
);

const metadataSchema = new Schema(
  {
    generatedAt: {
      type: Date,
      default: Date.now,
    },

    generationVersion: {
      type: String,
      default: "v1",
    },

    jobDescriptionHash: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const prepWorkspaceSchema = new Schema<PrepWorkspace>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    ownerType: {
      type: String,
      enum: ["user", "admin", "system"],
      default: "user",
      required: true,
    },

    atsAnalysisId: {
      type: Schema.Types.ObjectId,
      ref: "ATSAnalysis",
      required: true,
      index: true,
    },

    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "MasterResume",
      required: true,
    },

    tailoredResumeId: {
      type: Schema.Types.ObjectId,
      ref: "TailoredResume",
    },

    researchDocumentId: {
      type: Schema.Types.ObjectId,
      ref: "ResearchDocument",
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    workspaceHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "QUESTIONS_GENERATED",
        "IN_PROGRESS",
        "COMPLETED",
      ] satisfies PrepWorkspaceStatus[],
      default: "CREATED",
    },

    preparationProgress: {
      type: preparationProgressSchema,
      default: () => ({
        totalQuestions: 0,
        completedQuestions: 0,
        accuracy: null,
      }),
    },

    metadata: {
      type: metadataSchema,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "prep_workspaces",
  }
);

prepWorkspaceSchema.index({
  userId: 1,
  createdAt: -1,
});

prepWorkspaceSchema.index({
  userId: 1,
  atsAnalysisId: 1,
});

prepWorkspaceSchema.index({
  status: 1,
});

prepWorkspaceSchema.index({
  isDeleted: 1,
});

export const PrepWorkspaceModel = model<PrepWorkspace>(
  "PrepWorkspace",
  prepWorkspaceSchema
);