import { aiService }
    from "../../infrastructure/ai/ai.service.js";

import { resumesRepository }
    from "../resumes/resumes.repository.js";

import { atsRepository }
    from "../ats/ats.repository.js";

import {
    tailoredResumeRepository,
} from "./tailoredResume.repository.js";

import {
    buildTailoredResumePrompt,
} from "./tailoredResume.prompts.js";
import { StructuredResume } from "../resumes/resume.types.js";
import { latexService } from "../../infrastructure/pdf/latex.service.js";
import { pdfService } from "../../infrastructure/pdf/pdf.service.js";
import { resumeFileStorage } from "../../infrastructure/storage/resumeFileStorage.js";
import { normalizeTailoredResume, sanitizeResumeData } from "./tailoredResume.normalizer.js";


class TailoredResumeService {

    async generate(
    userId: string,
    resumeId: string,
    atsAnalysisId: string
) {
    try {
        const existing =
            await tailoredResumeRepository.findByATS(
                userId,
                atsAnalysisId
            );

        if (existing) {
            return existing;
        }

        const resume =
            await resumesRepository.findByIdForUser(
                userId,
                resumeId
            );

        if (!resume) {
            throw new Error("Resume not found");
        }

        const ats =
            await atsRepository.findById(
                userId,
                atsAnalysisId
            );

        if (!ats) {
            throw new Error("ATS analysis not found");
        }

        const cleanedOriginalResume = sanitizeResumeData(resume.structuredData as StructuredResume);
        
        let tailoredContent =
            await aiService.json(
                buildTailoredResumePrompt(
                    cleanedOriginalResume,
                    resume.parsedText,
                    ats.analysis,
                    ats.jobDescription
                )
            );

            tailoredContent =
  normalizeTailoredResume(
    tailoredContent
  );

            console.log(
      "TAILORED CONTENT:\n",
      JSON.stringify(tailoredContent, null, 2)
    );

        let latexContent: string;

        try {
            latexContent = latexService.generate(
                tailoredContent
            );
        } catch (error) {
            console.error("LaTeX generation failed:", error);
            throw new Error("Failed to generate LaTeX resume");
        }

        let pdfBuffer: Buffer;

        try {
            pdfBuffer = await pdfService.compile(
                latexContent
            );
        } catch (error) {
            console.error("PDF compilation failed:", error);
            throw new Error("Failed to compile PDF");
        }

        let storedPdf;

        try {
            storedPdf = await resumeFileStorage.saveGeneratedFile(
                pdfBuffer,
                `${crypto.randomUUID()}.pdf`,
                "application/pdf",
                userId,
                "tailored-resumes"
            );
        } catch (error) {
            console.error("File storage failed:", error);
            throw new Error("Failed to store generated PDF");
        }

        return await tailoredResumeRepository.create({
            userId,
            resumeId,
            atsAnalysisId,

            jobTitle: ats.jobTitle,
            companyName: ats.companyName,

            tailoredContent,
            latexContent,

            pdfUrl: storedPdf.url,
            pdfPublicId: storedPdf.publicId,
            pdfStorageProvider: storedPdf.provider,

            generationMetadata: {
                model: process.env.GROQ_MODEL,
                version: "v1",
                template: "jakes",
            },
        });

    } catch (error) {
        console.error("TailoredResumeService.generate FAILED:", error);

        throw new Error(
            error instanceof Error
                ? error.message
                : "Unknown error occurred while generating tailored resume"
        );
    }
}

    get(
        userId: string,
        id: string
    ) {
        return tailoredResumeRepository
            .findById(
                userId,
                id
            );
    }

    list(userId: string) {
        return tailoredResumeRepository
            .findAll(userId);
    }
}

export const tailoredResumeService =
    new TailoredResumeService();