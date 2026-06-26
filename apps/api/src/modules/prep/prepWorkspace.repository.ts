import { FilterQuery, UpdateQuery } from "mongoose";
import { PrepWorkspaceModel } from "./prepWorkspace.model.js";
import { PrepWorkspace } from "./prepWorkspace.types.js";

export class PrepWorkspaceRepository {
    async create(
        data: Partial<PrepWorkspace>
    ) {
        return PrepWorkspaceModel.create(data);
    }

    async findById(
        workspaceId: string
    ) {
        return PrepWorkspaceModel.findOne({
            _id: workspaceId,
            isDeleted: false,
        });
    }

    async findByWorkspaceHash(
        workspaceHash: string
    ) {
        return PrepWorkspaceModel.findOne({
            workspaceHash,
            isDeleted: false,
        });
    }

    async findByATSAnalysisId(
        atsAnalysisId: string
    ) {
        return PrepWorkspaceModel.findOne({
            atsAnalysisId,
            isDeleted: false,
        });
    }

    async listByUser(
        userId: string
    ) {
        return PrepWorkspaceModel.find({
            userId,
            isDeleted: false,
        }).sort({
            createdAt: -1,
        });
    }

    async updateStatus(
        workspaceId: string,
        status: PrepWorkspace["status"]
    ) {
        return PrepWorkspaceModel.findOneAndUpdate(
            {
                _id: workspaceId,
                isDeleted: false,
            },
            {
                status,
            },
            {
                new: true,
            }
        );
    }

    async updateProgress(
        workspaceId: string,
        progress: Partial<
            PrepWorkspace["preparationProgress"]
        >
    ) {
        const update: Record<string, unknown> = {};

        if (progress.totalQuestions !== undefined) {
            update["preparationProgress.totalQuestions"] =
                progress.totalQuestions;
        }

        if (progress.completedQuestions !== undefined) {
            update["preparationProgress.completedQuestions"] =
                progress.completedQuestions;
        }

        if (progress.accuracy !== undefined) {
            update["preparationProgress.accuracy"] =
                progress.accuracy;
        }
        return PrepWorkspaceModel.findOneAndUpdate(
            {
                _id: workspaceId,
                isDeleted: false,
            },
            {
                $set: update,
            },
            {
                new: true,
            }
        );
    }

    async updateOne(
        filter: FilterQuery<PrepWorkspace>,
        update: UpdateQuery<PrepWorkspace>
    ) {
        return PrepWorkspaceModel.findOneAndUpdate(
            filter,
            update,
            {
                new: true,
            }
        );
    }

    async softDelete(
        workspaceId: string
    ) {
        return PrepWorkspaceModel.findOneAndUpdate(
            {
                _id: workspaceId,
                isDeleted: false,
            },
            {
                isDeleted: true,
                deletedAt: new Date(),
            },
            {
                new: true,
            }
        );
    }

    async existsForATS(
        atsAnalysisId: string
    ) {
        return PrepWorkspaceModel.exists({
            atsAnalysisId,
            isDeleted: false,
        });
    }


}


export const prepWorkspaceRepository =
    new PrepWorkspaceRepository();