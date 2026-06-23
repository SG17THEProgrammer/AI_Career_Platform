export const buildStructuredResumePrompt = (
  resumeText: string
) => [
  {
    role: "system" as const,
    content: `
You are an expert resume parser.

Extract the resume into structured JSON.

Return VALID JSON only.

Do not omit any section.

If you find sections that do not fit the schema,
place them into additionalSections.

Use empty arrays instead of null.
`,
  },
  {
    role: "user" as const,
    content: resumeText,
  },
];