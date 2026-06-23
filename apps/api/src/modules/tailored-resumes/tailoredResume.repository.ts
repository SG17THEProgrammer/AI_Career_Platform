import { TailoredResumeModel }
  from "./tailoredResume.model.js";

class TailoredResumeRepository {
  create(data: any) {
    return TailoredResumeModel.create(data);
  }

  findById(
    userId: string,
    id: string
  ) {
    return TailoredResumeModel.findOne({
      _id: id,
      userId,
    });
  }

  findAll(userId: string) {
    return TailoredResumeModel
      .find({
        userId,
      })
      .sort({
        createdAt: -1,
      });
  }

  findByATS(
    userId: string,
    atsAnalysisId: string
  ) {
    return TailoredResumeModel.findOne({
      userId,
      atsAnalysisId,
    });
  }
}

export const tailoredResumeRepository =
  new TailoredResumeRepository();