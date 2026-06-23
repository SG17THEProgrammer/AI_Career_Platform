import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const execFileAsync = promisify(execFile);

class PdfService {
  async compile(latexContent: string): Promise<Buffer> {
    const tempDir = path.join(
      os.tmpdir(),
      "career-os",
      crypto.randomUUID()
    );

    await fs.mkdir(tempDir, {
      recursive: true
    });

    const texFile = path.join(
      tempDir,
      "resume.tex"
    );

    const pdfFile = path.join(
      tempDir,
      "resume.pdf"
    );

    try {
      await fs.writeFile(
        texFile,
        latexContent,
        "utf8"
      );

      await execFileAsync(
        "xelatex",
        [
          "-interaction=nonstopmode",
          "-halt-on-error",
          "-output-directory",
          tempDir,
          texFile
        ],
        {
          timeout: 0,
          maxBuffer:
            20 * 1024 * 1024
        }
      );

      return await fs.readFile(pdfFile);
    } finally {
      await fs.rm(tempDir, {
        recursive: true,
        force: true
      });
    }
  }
}

export const pdfService =
  new PdfService();