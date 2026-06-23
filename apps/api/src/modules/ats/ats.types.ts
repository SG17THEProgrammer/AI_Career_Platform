export interface ExtractedRequirements {
  jobTitle?: string;
  companyName?: string;

  hardSkills: string[];
  softSkills: string[];
  technologies: string[];
  certifications: string[];
  educationRequirements: string[];
  responsibilities: string[];
  keywords: string[];

  minimumExperienceYears?: number;
}

export interface SkillEvidence {
  skill: string;
  evidence: string[];
}

export interface ResumeAnalysisResult {
  matchedSkills: SkillEvidence[];
  missingSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface ATSScoreBreakdown {
  skillsScore: number;
  keywordScore: number;
  experienceScore: number;
  overallScore: number;
}