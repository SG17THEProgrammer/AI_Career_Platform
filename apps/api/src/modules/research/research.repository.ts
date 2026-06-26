import { ResearchDocumentModel } from "./research.model.js";

export class ResearchRepository {

    async create(data: Partial<ResearchDocumentModel>) {
  return ResearchDocumentModel.create(data);
}

async findById(id: string) {
  return ResearchDocumentModel.findById(id).lean();
}

async findDuplicate(params: {
  userId: string;
  resumeId: string;
  companyName: string;
  jobTitle: string;
  jobDescriptionHash: string;
}) {
  return ResearchDocumentModel.findOne({
    userId: params.userId,
    resumeId: params.resumeId,
    companyName: params.companyName,
    jobTitle: params.jobTitle,
    jobDescriptionHash: params.jobDescriptionHash,
  }).lean();
}

async listByUser(userId: string) {
  return ResearchDocumentModel.find({
    userId,
  })
    .sort({
      createdAt: -1,
    })
    .lean();
}
async update(
  id: string,
  data: Partial<ResearchDocumentModel>
) {
  return ResearchDocumentModel.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
    }
  ).lean();
}

async delete(id: string) {
  return ResearchDocumentModel.findByIdAndDelete(id);
}

async findByATSAnalysisId(
  atsAnalysisId: string
) {
  return ResearchDocumentModel.findOne({
    atsAnalysisId,
  });
}

}

export const researchRepository =
  new ResearchRepository();