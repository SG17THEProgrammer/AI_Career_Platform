import { aiService } from "../../infrastructure/ai/ai.service.js";
import {
  ExtractedRequirements,
  ResumeAnalysisResult,
} from "./ats.types.js";

export interface ATSScoreResult {
  skillsScore: number;
  keywordScore: number;
  experienceScore: number;
  overallScore: number;
}

export async function calculateATSScore(
  requirements: ExtractedRequirements,
  analysis: ResumeAnalysisResult
): Promise<ATSScoreResult> {
  
  const systemPrompt = `You are an expert Applicant Tracking System (ATS) scoring engine.
Your task is to evaluate how well a candidate's resume analysis matches the job requirements and output an objective set of scores.

Analyze the input data and calculate four scores on a scale from 0 to 100:
1. "skillsScore": Evaluates how well the candidate's matched skills cover the required hard skills and technologies.
2. "keywordScore": Evaluates keyword match density based on present vs missing keywords.
3. "experienceScore": Evaluates how well the candidate's background matches the implicit or explicit experience demands.
4. "overallScore": A holistic evaluation of the candidate's fit (not a strict mathematical average, but a weighted judgment of overall compatibility).

You MUST respond with a raw JSON object matching this TypeScript interface exactly:
{
  "skillsScore": number,
  "keywordScore": number,
  "experienceScore": number,
  "overallScore": number
}`;

  const userPrompt = `### Job Requirements
${JSON.stringify(requirements, null, 2)}

### Resume Analysis Data
${JSON.stringify(analysis, null, 2)}`;

  // Call your AI service using the JSON helper
  const scoreResult = await aiService.json<ATSScoreResult>([
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ]);

  return {
    skillsScore: Number(scoreResult.skillsScore) || 0,
    keywordScore: Number(scoreResult.keywordScore) || 0,
    experienceScore: Number(scoreResult.experienceScore) || 0,
    overallScore: Number(scoreResult.overallScore) || 0,
  };
}