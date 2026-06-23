import { ATSAnalysisModel } from "./ats.model.js";

class ATSRepository {
  create(data: any) {
    return ATSAnalysisModel.create(data);
  }

  findById(
    userId: string,
    analysisId: string
  ) {
    return ATSAnalysisModel.findOne({
      _id: analysisId,
      userId,
    });
  }

  findExisting(
  userId: string,
  resumeId: string,
  jobDescriptionHash: string
) {
  return ATSAnalysisModel.findOne({
    userId,
    resumeId,
    jobDescriptionHash,
  });
}


}

export const atsRepository =
  new ATSRepository();