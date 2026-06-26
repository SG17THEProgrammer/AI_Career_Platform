import { Types } from "mongoose";

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source?: string;
}

export interface SearchContext {
  companyResults: SearchResult[];
  roleResults: SearchResult[];
  interviewResults: SearchResult[];
  newsResults: SearchResult[];
}

export interface CompanyResearch {
  name: string;
  website?: string;

  overview: string;
  mission?: string;
  products: string[];
  businessModel?: string;

  techStack: string[];

  competitors: string[];

  culture?: string;

  funding?: string;

  latestNews: string[];

  interviewProcess?: string;
}

export interface RoleResearch {
  title: string;

  responsibilities: string[];

  requiredSkills: string[];

  preferredSkills: string[];

  technologies: string[];

  expectations: string[];

  salaryInsights?: string;
}

export interface InterviewInsights {
  rounds: string[];

  difficulty?: string;

  focusAreas: string[];

  commonTopics: string[];

  tips: string[];
}

export interface PreparationRoadmap {
  technicalTopics: string[];

  behavioralTopics: string[];

  projectsToRevise: string[];

  resumeWeakAreas: string[];

  studyPlan: string[];
}

export interface ResearchQuestions {
  technical: string[];

  behavioral: string[];

  resumeBased: string[];

  companySpecific: string[];
}

export interface ResearchReport {
  company: CompanyResearch;

  role: RoleResearch;

  interview: InterviewInsights;

  preparation: PreparationRoadmap;

  questions: ResearchQuestions;
}

export interface ResearchMetadata {
  generatedAt: Date;

  model: string;

  searchProviders: string[];

  generationVersion: number;
}

export interface ResearchDocument {
_id?: Types.ObjectId;

  userId: Types.ObjectId;

  ownerType: "user" | "admin" | "system";

  resumeId: Types.ObjectId;

  companyName: string;

  jobTitle: string;

  jobDescription: string;

  jobDescriptionHash: string;

  report: ResearchReport;

  searchContext: SearchContext;

  metadata: ResearchMetadata;

  atsAnalysisId: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}