import { createHash } from "crypto";

import { AppError } from "../../shared/errors/appError.js";

import {
    PrepWorkspaceStatus,
} from "./prepWorkspace.types.js";
import { prepWorkspaceRepository } from "./prepWorkspace.repository.js";

import { atsRepository } from "../ats/ats.repository.js";
import { researchRepository } from "../research/research.repository.js";
import { tailoredResumeRepository } from "../tailored-resumes/tailoredResume.repository.js";
import mongoose from "mongoose";

export class PrepWorkspaceService {
    async createWorkspace(
        userId: string,
        atsAnalysisId: string
    ) {
        //
        // 1. Load ATS Analysis
        //
        const ats =
            await atsRepository.findById(
                userId,
                atsAnalysisId
            );

        if (!ats) {
            throw new AppError(
                "ATS analysis not found"
            );
        }

        //
        // 2. Ownership check
        //
        if (
            ats.userId.toString() !== userId
        ) {
            throw new AppError(
                "Unauthorized"
            );
        }

        //
        // 3. Load Research
        //
        const research =
            await researchRepository.findByATSAnalysisId(
                atsAnalysisId
            );

        if (!research) {
            throw new AppError(
                "Research document not found"
            );
        }

        //
        // 4. Load Tailored Resume (optional)
        //
        const tailoredResume =
            await tailoredResumeRepository.findByATS?.(
                userId,
                atsAnalysisId
            );

        //
        // 5. Generate workspace hash
        //
        const workspaceHash =
            createHash("sha256")
                .update(
                    `${userId}:${ats.resumeId}:${ats.jobDescriptionHash}`
                )
                .digest("hex");

        //
        // 6. Duplicate prevention
        //
        const existingWorkspace =
            await prepWorkspaceRepository.findByWorkspaceHash(
                workspaceHash
            );

        if (existingWorkspace) {
            return existingWorkspace;
        }

        //
        // 7. Duplicate prevention : II
        //
        const existing =
            await prepWorkspaceRepository.findByATSAnalysisId(
                atsAnalysisId
            );

        if (existing) {
            return existing;
        }

        //
        // 8. Create workspace
        //
        return prepWorkspaceRepository.create({
            userId: new mongoose.Types.ObjectId(
                userId
            ),
            ownerType: "user",

            atsAnalysisId: ats._id,

            resumeId:
                ats.resumeId,

            tailoredResumeId:
                tailoredResume?._id,

            researchDocumentId:
                research._id,

            companyName:
                research.companyName,

            jobTitle:
                research.jobTitle,

            workspaceHash,

            status: "CREATED",

            preparationProgress: {
                totalQuestions: 0,
                completedQuestions: 0,
                accuracy: null,
            },

            metadata: {
                generatedAt: new Date(),
                generationVersion: "v1",
                jobDescriptionHash:
                    research.jobDescriptionHash,
            },
        });
    }

    async getWorkspace(
        userId: string,
        workspaceId: string
    ) {
        const workspace =
            await prepWorkspaceRepository.findById(
                workspaceId
            );

        if (!workspace) {
            throw new AppError(
                "Workspace not found"
            );
        }

        if (
            workspace.userId.toString() !==
            userId
        ) {
            throw new AppError(
                "Unauthorized"
            );
        }

        return workspace;
    }

    async listWorkspaces(
        userId: string
    ) {
        return prepWorkspaceRepository.listByUser(
            userId
        );
    }

    async updateStatus(
        userId: string,
        workspaceId: string,
        status: PrepWorkspaceStatus
    ) {
        const workspace =
            await this.getWorkspace(
                userId,
                workspaceId
            );

        const updated =
            await prepWorkspaceRepository.updateStatus(
                workspace._id.toString(),
                status
            );

        if (!updated) {
            throw new AppError(
                "Workspace not found"
            );
        }

        return updated;
    }

    async updateProgress(
        userId: string,
        workspaceId: string,
        progress: {
            totalQuestions?: number;
            completedQuestions?: number;
            accuracy?: number | null;
        }
    ) {
        const workspace =
            await this.getWorkspace(
                userId,
                workspaceId
            );

        const updated =
            await prepWorkspaceRepository.updateProgress(
                workspace._id.toString(),
                progress
            );

        if (!updated) {
            throw new AppError(
                "Workspace not found"
            );
        }

        return updated;
    }

    async deleteWorkspace(
        userId: string,
        workspaceId: string
    ) {
        const workspace =
            await this.getWorkspace(
                userId,
                workspaceId
            );

        const deleted =
            await prepWorkspaceRepository.softDelete(
                workspace._id.toString()
            );

        if (!deleted) {
            throw new AppError(
                "Workspace not found"
            );
        }

        return deleted;
    }
}

export const prepWorkspaceService =
    new PrepWorkspaceService();