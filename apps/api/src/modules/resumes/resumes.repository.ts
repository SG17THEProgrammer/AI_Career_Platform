import { Schema, Types } from "mongoose";
import { MasterResumeModel, type MasterResumeDocument } from "./masterResume.model.js";
import { User } from "../auth/auth.model.js";
import { StructuredResume } from "./resume.types.js";

export interface CreateMasterResumeData {
  userId: string;
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
  structuredData : StructuredResume | null;
  fingerprint: string;
  metadata: {
    pageCount?: number;
    wordCount: number;
    parser: string;
  };
}

export class ResumesRepository {
  async findDuplicate(userId: string, fingerprint: string) {
    return MasterResumeModel.findOne({
      userId: new Types.ObjectId(userId),
      fingerprint,
      deletedAt: { $exists: false }
    });
  }

  async create(data: CreateMasterResumeData) {
    return MasterResumeModel.create({
      ...data,
      userId: new Types.ObjectId(data.userId)
    });
  }

  async listByUser(userId: string) {
    return MasterResumeModel.find({
      userId: new Types.ObjectId(userId),
      deletedAt: { $exists: false }
    })
      .sort({ lastUsedAt: -1, createdAt: -1 })
      .lean();
  }

  async findByIdForUser(userId: string, resumeId: string) {
    if (!Types.ObjectId.isValid(resumeId)) {
      return null;
    }

    return MasterResumeModel.findOne({
      _id: new Types.ObjectId(resumeId),
      userId: new Types.ObjectId(userId),
      deletedAt: { $exists: false }
    });
  }

  async markLastUsed(resume: MasterResumeDocument) {
    resume.lastUsedAt = new Date();
    await resume.save();
    return resume;
  }

  async softDelete(resume: MasterResumeDocument) {
    resume.deletedAt = new Date();
    await resume.save();
  }

  async countByUser(userId: string) {
    return MasterResumeModel.countDocuments({
      userId: new Types.ObjectId(userId),
      deletedAt: { $exists: false }
    });
  }

  async findLatestByUser(userId: string) {
    return MasterResumeModel.findOne({
      userId: new Types.ObjectId(userId),
      deletedAt: { $exists: false }
    }).sort({
      createdAt: -1
    });
  }

  async setLastUsedResume(
    userId: string,
    resumeId: string | null
  ) {
    return User.findByIdAndUpdate(
      userId,
      {
        lastUsedResumeId: resumeId
      },
      {
        new: true
      }
    );
  }

}

export const resumesRepository = new ResumesRepository();
