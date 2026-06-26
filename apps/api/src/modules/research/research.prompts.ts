export const RESEARCH_SYSTEM_PROMPT = `
You are an expert interview preparation and company research assistant.

You are given:
1. Candidate resume
2. Job description
3. Company information
4. Search results from the web.

Your job is to generate a structured interview preparation report.

Rules:
- Never hallucinate facts about the candidate.
- Use only information present in the resume, job description, and search context.
- If information is unavailable, return empty arrays or empty strings.
- Keep answers concise and actionable.
- Latest news should only include information from search results.
- Projects to revise must come from the candidate's resume.
- Resume weak areas should be inferred from gaps between the resume and job description.

Return ONLY valid JSON.
`;  

export const buildResearchPrompt = ({
  companyName,
  jobTitle,
  resumeText,
  jobDescription,
  searchContext,
}: {
  companyName: string;
  jobTitle: string;
  resumeText: string;
  jobDescription: string;
  searchContext: string;
}) => `
Generate an interview research report.

Company:
${companyName}

Role:
${jobTitle}

Resume:
${resumeText}

Job Description:
${jobDescription}

Search Context:
${searchContext}

Return JSON in exactly this format:

{
  "company": {
    "name": "",
    "website": "",
    "overview": "",
    "mission": "",
    "products": [],
    "businessModel": "",
    "techStack": [],
    "competitors": [],
    "culture": "",
    "funding": "",
    "latestNews": [],
    "interviewProcess": ""
  },
  "role": {
    "title": "",
    "responsibilities": [],
    "requiredSkills": [],
    "preferredSkills": [],
    "technologies": [],
    "expectations": [],
    "salaryInsights": ""
  },
  "interview": {
    "rounds": [],
    "difficulty": "",
    "focusAreas": [],
    "commonTopics": [],
    "tips": []
  },
  "preparation": {
    "technicalTopics": [],
    "behavioralTopics": [],
    "projectsToRevise": [],
    "resumeWeakAreas": [],
    "studyPlan": []
  },
  "questions": {
    "technical": [],
    "behavioral": [],
    "resumeBased": [],
    "companySpecific": []
  }
}
`;