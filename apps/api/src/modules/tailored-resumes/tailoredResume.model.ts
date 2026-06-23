import { Schema, model } from "mongoose";

const tailoredResumeSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        resumeId: {
            type: Schema.Types.ObjectId,
            ref: "MasterResume",
            required: true,
        },

        atsAnalysisId: {
            type: Schema.Types.ObjectId,
            ref: "ATSAnalysis",
            required: true,
        },

        jobTitle: String,
        companyName: String,

        tailoredContent: {
            type: Schema.Types.Mixed,
            required: true,
        },

        generationMetadata: {
            model: String,
            version: String,
            template: String,
        },
        latexContent: {
            type: String,
        },

        pdfUrl: {
            type: String,
        },

        pdfStorageProvider: {
            type: String,
        },
        pdfPublicId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

tailoredResumeSchema.index({
    userId: 1,
    atsAnalysisId: 1,
});

export const TailoredResumeModel = model(
    "TailoredResume",
    tailoredResumeSchema
);