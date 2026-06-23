import { StructuredResume } from "../resumes/resume.types.js";

export const buildTailoredResumePrompt = (
  structuredResume: StructuredResume,
  parsedText: string,
  atsAnalysis: unknown,
  jobDescription: string
) => [
  {
    role: "system" as const,
    content: `You are an expert executive resume writer and ATS optimization engine.
Your objective is to take the candidate's original resume and rewrite it to perfectly target the provided Job Description.

HOW TO TAILOR THE RESUME (YOUR DIRECTIVES):
1. FIX PDF FRAGMENTS (CRITICAL): The input data contains broken text arrays caused by bad PDF parsing. 
   - Example Input: ["Developed a multi", "tenant SaaS...", "000 users", "utilizing React"]
   - Required Output: ["Developed a multi-tenant SaaS platform serving over 100,000 users, utilizing React."]
   - YOU MUST combine all fragmented phrases into complete, readable sentences.
2. The Summary: Completely rewrite the "summary" to be a compelling pitch specifically for THIS job. Use keywords from the Job Description.
3. Experience & Projects: 
   - Rewrite the "achievements" bullet points to mirror the vocabulary and priorities of the Job Description.
   - Reorder the bullet points so the most relevant achievements are at the top.

STRICT CONSTRAINTS:
- SENTENCE VALIDATION: EVERY single string inside an "achievements" array MUST be a complete, grammatically correct sentence. 
- NO PHRASES: DO NOT output short standalone phrases (e.g., "000 users", "and Node.js", "utilizing React") as separate array items. If an item lacks a subject and verb, combine it with the previous item!
- NO HALLUCINATIONS: Do not invent jobs, degrees, metrics, or technologies.
- FORMAT: You must return ONLY a raw, valid JSON object.`,
  },
  {
    role: "user" as const,
    content: `Return ONLY valid JSON matching this exact structure:

{
  "basics": {
    "name": "string", "title": "string", "email": "string", "phone": "string",
    "location": "string", "linkedin": "string", "github": "string", 
    "portfolio": "string", "summary": "string"
  },
  "skills": [
    { "category": "string", "items": ["string"] }
  ],
  "experience": [
    {
      "company": "string", "title": "string", "location": "string", 
      "startDate": "string", "endDate": "string", "current": boolean,
      "technologies": ["string"],
      "achievements": ["string (Merge fragments into complete sentences)"]
    }
  ],
  "education": [
    { "institution": "string", "degree": "string", "fieldOfStudy": "string", "startDate": "string", "endDate": "string", "cgpa": "string" }
  ],
  "projects": [
    {
      "name": "string", "description": "string", "link": "string", "technologies": ["string"],
      "achievements": ["string (Merge fragments into complete sentences)"]
    }
  ],
  "certifications": [
    { "name": "string", "issuer": "string", "issueDate": "string", "credentialId": "string", "url": "string" }
  ],
  "achievements": ["string"],
  "additionalSections": [
    { "title": "string", "items": ["string"] }
  ]
}

Rules:
- If a field is missing in the original resume, return an empty string "" or empty array [].
- DO NOT add new root fields. DO NOT rename fields.

### Job Description:
${jobDescription}

### ATS Analysis (Use this to guide your keyword integration):
${JSON.stringify(atsAnalysis, null, 2)}

### Original Resume Data (Rewrite and fix fragments):
${JSON.stringify(structuredResume, null, 2)}`
  },
];