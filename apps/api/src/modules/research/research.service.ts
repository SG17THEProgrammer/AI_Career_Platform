// apps/api/src/modules/research/research.service.ts

import crypto from "crypto";
import mongoose from "mongoose";
import { AppError } from "../../shared/errors/appError.js";

import { searchService } from "../../infrastructure/search/index.js";
import { aiService } from "../../infrastructure/ai/ai.service.js";

import { researchRepository } from "./research.repository.js";
import {
  RESEARCH_SYSTEM_PROMPT,
  buildResearchPrompt,
} from "./research.prompts.js";

import type { ResearchDocument, ResearchReport } from "./research.types.js";

interface GenerateResearchInput {
  userId: string;
  atsAnalysisId: string;
  resumeId: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumeText: string;
}

export class ResearchService {
  async generate(
    input: GenerateResearchInput
  ): Promise<ResearchDocument> {
    const {
      userId,
      atsAnalysisId,
      resumeId,
      companyName,
      jobTitle,
      jobDescription,
      resumeText,
    } = input;

    const jobDescriptionHash =
      this.generateJobDescriptionHash(
        jobDescription
      );

    const existing =
      await researchRepository.findByATSAnalysisId(
        atsAnalysisId
      );

    if (existing) {
      return existing;
    }

    const queries = [
      `${companyName} ${jobTitle} interview process tech stack culture`,
      `${companyName} latest news products competitors hiring`,
    ];

    const searchResponses =
      await searchService.searchMany(
        queries
      );

    const searchContext =
      searchResponses.flatMap(
        (response) => response.results
      );

    const prompt =
      buildResearchPrompt({
        companyName,
        jobTitle,
        resumeText,
        jobDescription,
        searchContext: JSON.stringify(
          searchContext,
          null,
          2
        ),
      });

    const completion =
      await aiService.json<ResearchReport>([
        {
          role: "system",
          content: RESEARCH_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ]);

    if (!completion) {
      throw new AppError(
        "Failed to generate research report",
        500
      );
    }

    const document =
      await researchRepository.create({
        userId: new mongoose.Types.ObjectId(
          userId
        ),
        atsAnalysisId: new mongoose.Types.ObjectId(
          atsAnalysisId
        ),
        ownerType: "user",
        resumeId:
          new mongoose.Types.ObjectId(
            resumeId
          ), companyName,
        jobTitle,
        jobDescription,
        jobDescriptionHash,

        report: completion,

        searchContext: {
          queries,
          results: searchResponses,
        },

        metadata: {
          generatedAt: new Date(),
          model:
            process.env
              .GROQ_MODEL ??
            "unknown",
          searchProviders: [
            ...new Set(
              searchResponses.map(
                (r) => r.provider
              )
            ),
          ],
          generationVersion: 1,
        },
      });

    return document as ResearchDocument;
  }

  async getById(
    id: string,
    userId: string
  ) {
    const document =
      await researchRepository.findById(
        id
      );

    if (!document) {
      throw new AppError(
        "Research report not found",
        404
      );
    }

    if (
      document.userId.toString() !==
      userId
    ) {
      throw new AppError(
        "Unauthorized",
        403
      );
    }

    return document;
  }

  async list(
    userId: string
  ) {
    return researchRepository.listByUser(
      userId
    );
  }

  private generateJobDescriptionHash(
    jobDescription: string
  ) {
    return crypto
      .createHash("sha256")
      .update(
        jobDescription.trim()
      )
      .digest("hex");
  }
}

export const researchService =
  new ResearchService();