import mongoose, { Schema, model, type HydratedDocument, type Model, type Types } from "mongoose";
import { StructuredResume } from "./resume.types.js";

export interface MasterResume {
  userId: Types.ObjectId;
  ownerType: "user" | "admin" | "system";
  displayName: string;
  originalFileName: string;
  fileUrl: string;
  storageProvider: "cloudinary" | "local";
  storagePublicId?: string;
  fileSizeBytes: number;
  mimeType: string;
  parsedText: string;
  normalizedText: string;
  structuredData?: StructuredResume | null;
  fingerprint: string;
  metadata?: {
    pageCount?: number;
    wordCount?: number;
    parser?: string;
  };
  lastUsedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}


const masterResumeSchema = new Schema<MasterResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    },
    ownerType: {
      type: String,
      enum: ["user", "admin", "system"],
      required: true,
      default: "user"
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    originalFileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    storageProvider: {
      type: String,
      enum: ["cloudinary", "local"],
      required: true
    },
    storagePublicId: {
      type: String
    },
    fileSizeBytes: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    parsedText: {
      type: String,
      required: true
    },
    normalizedText: {
      type: String,
      required: true,
      select: false
    },
    structuredData: {
      type: Schema.Types.Mixed,
      default: null
    },
    fingerprint: {
      type: String,
      required: true
    },
    metadata: {
      pageCount: Number,
      wordCount: Number,
      parser: String
    },
    lastUsedAt: {
      type: Date
    },
    deletedAt: {
      type: Date,
      index: true
    },
  },
  {
    timestamps: true
  }
);

// Compound index for soft-deleted unique check
masterResumeSchema.index(
  { userId: 1, fingerprint: 1 },
  { unique: true, partialFilterExpression: { deletedAt: { $exists: false } } }
);

export type MasterResumeDocument = HydratedDocument<MasterResume>;

// Fixed ESM named export issue and applied strong model typing
export const MasterResumeModel: Model<MasterResume> =
  mongoose.models.MasterResume ||
  model<MasterResume>("MasterResume", masterResumeSchema, "master_resumes");
