export type UserRole = "user" | "admin";

export type OwnerType = "user" | "admin" | "system";

export type JobPipelineStatus =
  | "NEW"
  | "REVIEWING"
  | "TAILORED"
  | "APPLIED"
  | "INTERVIEWING"
  | "REJECTED"
  | "OFFER";

export type QuestionType = "MCQ" | "SUBJECTIVE";

export type QuestionGenerationType = "MCQ_PRACTICE" | "SUBJECTIVE" | "TIMED_ASSESSMENT";

export type DifficultyRating = "EASY" | "MEDIUM" | "HARD";

export interface ResumeMetadata {
  pageCount?: number;
  wordCount?: number;
  parser?: string;
}

export interface MasterResumeSummary {
  id: string;
  displayName: string;
  originalFileName: string;
  fileUrl: string;
  storageProvider: "cloudinary" | "local";
  fileSizeBytes: number;
  mimeType: string;
  parsedTextPreview: string;
  fingerprint: string;
  metadata?: ResumeMetadata;
  lastUsedAt?: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
