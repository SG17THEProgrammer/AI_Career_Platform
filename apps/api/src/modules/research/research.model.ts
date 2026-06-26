import mongoose, { Schema, InferSchemaType } from "mongoose";

const researchDocumentSchema = new Schema(
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

    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "MasterResume",
      required: true,
      index: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
      // index: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
      // index: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    jobDescriptionHash: {
      type: String,
      required: true,
      index: true,
    },

    report: {
      type: Schema.Types.Mixed,
      required: true,
    },

    searchContext: {
      type: Schema.Types.Mixed,
      default: {},
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    atsAnalysisId: {
      type: Schema.Types.ObjectId,
      ref: "ATSAnalysis",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "research_documents",
  }
);

researchDocumentSchema.index(
  {
    userId: 1,
    resumeId: 1,
    companyName: 1,
    jobTitle: 1,
    jobDescriptionHash: 1,
  },
  {
    unique: true,
    name: "research_dedup_idx",
  }
);

researchDocumentSchema.index({
  userId: 1,
  createdAt: -1,
});

researchDocumentSchema.index({
  companyName: 1,
});

researchDocumentSchema.index({
  jobTitle: 1,
});

export type ResearchDocumentModel =
  InferSchemaType<typeof researchDocumentSchema>;

export const ResearchDocumentModel = mongoose.model(
  "ResearchDocument",
  researchDocumentSchema
);

