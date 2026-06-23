import { Schema, model, Types } from "mongoose";
import {
  ExtractedRequirements,
  ResumeAnalysisResult,
} from "./ats.types.js";


const atsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    resumeId: {
      type: Schema.Types.ObjectId,
      ref: "MasterResume",
      required: true,
    },

    jobTitle: String,
    companyName: String,

    jobDescription: {
      type: String,
      required: true,
    },
    
    extractedRequirements: {
      type: Schema.Types.Mixed,
      required: true,
    },

    analysis: {
      type: Schema.Types.Mixed,
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    
    createdAt: {
      type: Date,
      default: Date.now,
    },
    jobDescriptionHash: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
  }
);

atsSchema.index(
  {
    userId: 1,
    resumeId: 1,
    jobDescriptionHash: 1,
  },
  {
    unique: true,
  }
);

export const ATSAnalysisModel =
  model("ATSAnalysis", atsSchema);