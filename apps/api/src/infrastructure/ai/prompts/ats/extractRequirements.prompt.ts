export const buildExtractRequirementsPrompt = (jobDescription: string) => [
  {
    role: "system" as const,
    content: `You are an expert Applicant Tracking System (ATS) parser and technical recruiter.
Your task is to extract highly structured data from the provided job description.
Categorize items accurately and be comprehensive.

EXTRACTION GUIDELINES:
- hardSkills: Broad technical or domain-specific abilities (e.g., Data Analysis, Accounting, System Architecture).
- softSkills: Interpersonal, cognitive, or behavioral abilities (e.g., Leadership, Communication, Problem Solving).
- technologies: Specific tools, software, programming languages, or frameworks (e.g., React, Excel, Python, AWS).
- keywords: Important industry jargon, methodologies (e.g., Agile, B2B, CI/CD), or core concepts not covered above.
- minimumExperienceYears: Extract as a number. If a range is given (e.g., "3-5 years"), extract the minimum (3). If experience is not explicitly stated, omit the field.
- responsibilities: Summarize the core day-to-day duties expected of the role.

You MUST respond with ONLY a raw JSON object matching this exact structure:
{
  "jobTitle": "string",
  "companyName": "string",
  "hardSkills": ["string"],
  "softSkills": ["string"],
  "technologies": ["string"],
  "certifications": ["string"],
  "educationRequirements": ["string"],
  "responsibilities": ["string"],
  "keywords": ["string"],
  "minimumExperienceYears": number
}`,
  },
  {
    role: "user" as const,
    content: `### Job Description:\n${jobDescription}`,
  },
];