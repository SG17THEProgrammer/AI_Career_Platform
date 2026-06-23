import { createHash } from "node:crypto";
import { PDFParse } from "pdf-parse";
import { StructuredResume } from "./resume.types.js";
import { aiService } from "../../infrastructure/ai/ai.service.js";
import { buildStructuredResumePrompt } from "../../infrastructure/ai/prompts/resume/extractStructuredResume.prompt.js";

export interface ParsedResume {
  parsedText: string;
  normalizedText: string;
  fingerprint: string;
  metadata: {
    pageCount?: number;
    wordCount: number;
    parser: "pdf-parse" | "plain-text";
  };
}

export async function parseResumeFile(file: Express.Multer.File): Promise<ParsedResume> {
  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: file.buffer });
    try {
      const parsed = await parser.getText();
      return toParsedResume(parsed.text, {
        pageCount: parsed.total,
        parser: "pdf-parse"
      });
    } finally {
      await parser.destroy();
    }
  }

  if (file.mimetype === "text/plain") {
    return toParsedResume(file.buffer.toString("utf8"), {
      parser: "plain-text"
    });
  }

  throw new Error("Unsupported resume file type");
}

function toParsedResume(
  text: string,
  metadata: { pageCount?: number; parser: ParsedResume["metadata"]["parser"] }
): ParsedResume {
  const parsedText = text.trim();
  const normalizedText = normalizeResumeText(parsedText);
  const wordCount = normalizedText ? normalizedText.split(" ").length : 0;

  return {
    parsedText,
    normalizedText,
    fingerprint: createHash("sha256").update(normalizedText).digest("hex"),
    metadata: {
      ...metadata,
      wordCount
    }
  };
}

export function normalizeResumeText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s.+#-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function
extractStructuredResume(
  resumeText: string
): Promise<StructuredResume> {
  return aiService.json<StructuredResume>(
    buildStructuredResumePrompt(
      resumeText
    )
  );
}
