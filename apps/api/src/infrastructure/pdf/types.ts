import {
  TailoredResumeContent,
} from "../../modules/tailored-resumes/tailoredResume.types.js";

export interface ResumeTemplate {
  render(
    resume: TailoredResumeContent
  ): string;
}