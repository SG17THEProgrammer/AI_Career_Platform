import { aiService } from "../../infrastructure/ai/ai.service.js";
import {
  buildExtractRequirementsPrompt,
} from "../../infrastructure/ai/prompts/ats/extractRequirements.prompt.js";

import {
  buildResumeAnalysisPrompt,
} from "../../infrastructure/ai/prompts/ats/analyzeResume.prompt.js";

import { calculateATSScore }
  from "./ats.scoring.js";

import { atsRepository }
  from "./ats.repository.js";

import { resumesRepository }
  from "../resumes/resumes.repository.js";
import { ExtractedRequirements, ResumeAnalysisResult } from "./ats.types.js";
import { createHash } from "crypto";
class ATSService {
  async analyze(
    userId: string,
    resumeId: string,
    jobDescription: string
  ) {
    const resume =
      await resumesRepository.findByIdForUser(
        userId,
        resumeId
      );

    if (!resume) {
      throw new Error(
        "Resume not found"
      );
    }

    const normalizedJobDescription =
      jobDescription.trim().toLowerCase().replace(/\s+/g, " ");

    const jobDescriptionHash =
      createHash("sha256")
        .update(normalizedJobDescription)
        .digest("hex");


    const existing =
      await atsRepository.findExisting(
        userId,
        resumeId,
        jobDescriptionHash
      );

    if (existing) {
      return existing;
    }


    const requirements =
      await aiService.json<ExtractedRequirements>(
        buildExtractRequirementsPrompt(jobDescription)
      );

    const analysis =
      await aiService.json<ResumeAnalysisResult>(
        buildResumeAnalysisPrompt(
          resume.parsedText,
          requirements
        )
      );

    const score = await
      calculateATSScore(
        requirements,
        analysis
      );




    return atsRepository.create({
      userId,
      resumeId,
      jobTitle:
        requirements.jobTitle,
      companyName:
        requirements.companyName,
      jobDescription,
      jobDescriptionHash,
      extractedRequirements:
        requirements,
      analysis,
      score:
        score.overallScore,
    });
  }

  async getAnalysis(
    userId: string,
    analysisId: string
  ) {
    return atsRepository.findById(
      userId,
      analysisId
    );
  }
}

export const atsService =
  new ATSService();