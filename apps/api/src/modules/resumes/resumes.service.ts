import { AppError } from "../../shared/errors/appError.js";
import { resumeFileStorage } from "../../infrastructure/storage/resumeFileStorage.js";
import type { StoredFile } from "../../infrastructure/storage/storage.types.js";
import { extractStructuredResume, parseResumeFile } from "./resumeParser.js";
import { resumesRepository } from "./resumes.repository.js";
import { StructuredResume } from "./resume.types.js";
import { MasterResumeDocument } from "./masterResume.model.js";

const allowedMimeTypes = new Set(["application/pdf", "text/plain"]);
const maxResumeBytes = 5 * 1024 * 1024;

export class ResumesService {
  async uploadResume(userId: string, file: Express.Multer.File | undefined, displayName?: string) {
    if (!file) {
      throw new AppError("Resume file is required", 400, "RESUME_FILE_REQUIRED");
    }

    if (!allowedMimeTypes.has(file.mimetype)) {
      throw new AppError("Only PDF and plain text resumes are supported", 400, "UNSUPPORTED_FILE_TYPE");
    }

    if (file.size > maxResumeBytes) {
      throw new AppError("Resume file must be 5 MB or smaller", 400, "RESUME_FILE_TOO_LARGE");
    }

    const parsed = await parseResumeFile(file).catch(() => {
      throw new AppError("Unable to extract text from resume", 422, "RESUME_PARSE_FAILED");
    });

    if (parsed.metadata.wordCount < 30) {
      throw new AppError("Resume text extraction produced too little content", 422, "RESUME_TOO_SHORT");
    }

    const duplicate = await resumesRepository.findDuplicate(userId, parsed.fingerprint);
    if (duplicate) {
      throw new AppError("This resume has already been uploaded", 409, "DUPLICATE_RESUME");
    }

    let structuredData;

    try {
      structuredData =
        await extractStructuredResume(
          parsed.parsedText
        );
    }
    catch (error) {
      structuredData = null;

      throw new AppError(
        "Unable to extract structured data from resume",
        422,
        "RESUME_STRUCTURED_DATA_EXTRACTION_FAILED"
      );
    }

    let storedFile: StoredFile | undefined;

    try {
      storedFile = await resumeFileStorage.saveResumeFile(file, userId);

      const resume = await resumesRepository.create({
        userId,
        ownerType: "user",
        displayName: displayName?.trim() || stripExtension(file.originalname),
        originalFileName: file.originalname,
        fileUrl: storedFile.url,
        storageProvider: storedFile.provider,
        storagePublicId: storedFile.publicId,
        fileSizeBytes: storedFile.bytes,
        mimeType: storedFile.mimeType,
        parsedText: parsed.parsedText,
        normalizedText: parsed.normalizedText,
        structuredData,
        fingerprint: parsed.fingerprint,
        metadata: parsed.metadata
      });

      const count =
        await resumesRepository.countByUser(
          userId
        );

      if (count === 1) {
        await resumesRepository.setLastUsedResume(
          userId,
          String(resume._id)
        );

        await resumesRepository.markLastUsed(
          resume
        );
      }

      return this.toResumeResponse(resume);
    } catch (error) {
      if (storedFile) {
        await resumeFileStorage.deleteFile(storedFile);
      }
      throw error;
    }
  }

  async listResumes(userId: string) {
    const resumes = await resumesRepository.listByUser(userId);
    return resumes.map((resume) => this.toResumeResponse(resume as MasterResumeDocument));
  }

  async getResume(userId: string, resumeId: string) {
    const resume = await resumesRepository.findByIdForUser(userId, resumeId);
    if (!resume) {
      throw new AppError("Resume not found", 404, "RESUME_NOT_FOUND");
    }

    return this.toResumeResponse(resume);
  }

  async selectResume(
    userId: string,
    resumeId: string
  ) {
    const resume =
      await resumesRepository.findByIdForUser(
        userId,
        resumeId
      );

    if (!resume) {
      throw new AppError(
        "Resume not found",
        404,
        "RESUME_NOT_FOUND"
      );
    }

    await resumesRepository.setLastUsedResume(
      userId,
      resumeId
    );

    await resumesRepository.markLastUsed(
      resume
    );

    return this.toResumeResponse(resume);
  }

  async markLastUsed(userId: string, resumeId: string) {
    const resume = await resumesRepository.findByIdForUser(userId, resumeId);
    if (!resume) {
      throw new AppError("Resume not found", 404, "RESUME_NOT_FOUND");
    }

    return this.toResumeResponse(await resumesRepository.markLastUsed(resume));
  }

  async deleteResume(userId: string, resumeId: string) {
    const resume = await resumesRepository.findByIdForUser(userId, resumeId);
    if (!resume) {
      throw new AppError("Resume not found", 404, "RESUME_NOT_FOUND");
    }

    await resumesRepository.softDelete(resume);

    const count =
      await resumesRepository.countByUser(
        userId
      );

    if (count === 0) {
      await resumesRepository.setLastUsedResume(
        userId,
        null
      );
    }

    if (count === 1) {
      const latest =
        await resumesRepository.findLatestByUser(
          userId
        );

      if (latest) {
        await resumesRepository.setLastUsedResume(
          userId,
          String(latest._id)
        );
      }
    }
  }

  private toResumeResponse(resume: MasterResumeDocument): any {
    return {
      id: String(resume._id),
      displayName: resume.displayName,
      originalFileName: resume.originalFileName,
      fileUrl: resume.fileUrl,
      storageProvider: resume.storageProvider,
      fileSizeBytes: resume.fileSizeBytes,
      mimeType: resume.mimeType,
      parsedTextPreview: resume.parsedText.slice(0, 500),
      structuredData:
        resume.structuredData,
      fingerprint: resume.fingerprint,
      metadata: resume.metadata ?? undefined,
      lastUsedAt: resume.lastUsedAt,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt
    };
  }
}

function stripExtension(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "") || "Resume";
}

export const resumesService = new ResumesService();
