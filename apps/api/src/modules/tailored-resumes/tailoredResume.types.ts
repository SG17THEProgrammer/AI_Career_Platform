import { StructuredResume } from "../resumes/resume.types.js";

export interface TailoredResumeContent
    extends StructuredResume { }

export interface GenerationMetadata {
    model: string;
    version: string;
}

export interface TailoredResumeDocument {
    userId: string;
    resumeId: string;
    atsAnalysisId: string;

    jobTitle?: string;
    companyName?: string;

    tailoredContent: TailoredResumeContent;

    generationMetadata: GenerationMetadata;

    latexContent: String;

    pdfUrl: String,

    pdfStorageProvider: String,

    pdfPublicId: String,




    createdAt: Date;
    updatedAt: Date;
}