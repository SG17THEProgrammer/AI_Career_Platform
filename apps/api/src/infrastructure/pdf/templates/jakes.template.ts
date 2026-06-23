import { ResumeTemplate } from "../types.js";
import { StructuredResume } from "../../../modules/resumes/resume.types.js";

export class JakesTemplate implements ResumeTemplate {
  render(resume: StructuredResume): string {
    try {
      const basics = resume.basics ?? {};

      return `
\\documentclass[11pt]{article}
\\usepackage[margin=0.5in]{geometry}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}

% Classic Jake's Resume formatting
\\setcounter{secnumdepth}{0}
\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{\\thesection}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\setlist[itemize]{leftmargin=0.15in, topsep=2pt, itemsep=0pt, parsep=1pt}

\\begin{document}

\\begin{center}
{\\Huge \\textbf{${this.escape(basics.name)}}} \\\\ \\vspace{2pt}
${this.contactLine(basics)}
\\end{center}

${this.renderSummary(basics.summary)}

${this.renderExperience(resume.experience ?? [])}

${this.renderProjects(resume.projects ?? [])}

${this.renderEducation(resume.education ?? [])}

${this.renderSkills(resume.skills ?? [])}

${this.renderCertifications(
  resume.certifications ?? []
)}

${this.renderAchievements(
  resume.achievements ?? []
)}

${this.renderAdditionalSections(
  resume.additionalSections ?? []
)}

\\end{document}
`;
    } catch (error) {
      throw new Error(
        `Failed to render LaTeX template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private contactLine(basics: StructuredResume["basics"]): string {
    return [
      basics.email,
      basics.phone,
      basics.location,
      basics.linkedin,
      basics.github,
      basics.portfolio,
    ]
      .filter(Boolean)
      .map((x) => this.escape(String(x)))
      .join(" $\\vert$ ");
  }

  private renderSummary(summary?: string): string {
    if (!summary) return "";
    return `
\\section{Summary}
\\noindent ${this.escape(summary)}
`;
  }

  private renderExperience(experience: StructuredResume["experience"]): string {
    if (!experience.length) return "";

    return `
\\section{Experience}
${experience
  .map((e) => {
    const dates = e.startDate || e.endDate
      ? `${this.escape(e.startDate ?? "")} -- ${e.current ? "Present" : this.escape(e.endDate ?? "")}`
      : "";

    // Dynamically build the header lines so missing data doesn't break formatting
    const headerLines: string[] = [];
    
    // Line 1: Title, Company, Dates
    headerLines.push(`\\textbf{${this.escape(e.title)}}${e.company ? ` -- \\textit{${this.escape(e.company)}}` : ""} \\hfill ${dates}`);
    
    // Line 2: Location (Optional)
    if (e.location) {
      headerLines.push(`\\textit{${this.escape(e.location)}}`);
    }
    
    // Line 3: Technologies indented directly under the job
    if (e.technologies && e.technologies.length > 0) {
      headerLines.push(`\\hspace*{0.15in}\\small{\\textbf{\\textit{Technologies:}} \\textit{${this.escape(e.technologies.join(", "))}}}`);
    }

    return `
\\vspace{3pt}
\\noindent
${headerLines.join(" \\\\\n")}
\\vspace{-4pt}
${this.renderBullets(e.achievements)}
`;
  })
  .join("\n")}
`;
  }

  private renderProjects(projects: StructuredResume["projects"]): string {
    if (!projects.length) return "";

    return `
\\section{Projects}
${projects
  .map((p) => {
    // Fallback to "Project" if LLM forgets the name field
    const name = p.name ? this.escape(p.name) : "Project";
    const headerLines: string[] = [];

    // Line 1: Name, Tech stack, Link
    let line1 = `\\textbf{${name}}`;
    if (p.technologies && p.technologies.length > 0) {
      line1 += ` $|$ \\textit{${this.escape(p.technologies.join(", "))}}`;
    }
    if (p.link) {
      line1 += ` \\hfill \\href{${this.escape(p.link)}}{\\textit{Link}}`;
    }
    headerLines.push(line1);

    // Line 2: Description (Optional)
    if (p.description) {
      headerLines.push(`\\vspace{1pt}\\noindent ${this.escape(p.description)}`);
    }

    return `
\\vspace{3pt}
\\noindent
${headerLines.join(" \\\\\n")}
\\vspace{-4pt}
${this.renderBullets(p.achievements)}
`;
  })
  .join("\n")}
`;
  }

  private renderEducation(education: StructuredResume["education"]): string {
    if (!education.length) return "";

    return `
\\section{Education}
${education
  .map((e) => {
    const dates = e.startDate || e.endDate
      ? `${this.escape(e.startDate ?? "")} -- ${this.escape(e.endDate ?? "")}`
      : "";

    return `
\\vspace{3pt}
\\noindent
\\textbf{${this.escape(e.institution)}} \\hfill ${dates} \\\\
${this.escape(e.degree)}${e.fieldOfStudy ? ` in ${this.escape(e.fieldOfStudy)}` : ""}${e.cgpa ? ` \\hfill CGPA: ${this.escape(e.cgpa)}` : ""}
`;
  })
  .join("\n")}
`;
  }

  private renderSkills(skills: StructuredResume["skills"]): string {
    if (!skills.length) return "";

    return `
\\section{Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
\\small{\\item{
${skills
  .map(
    (skill) =>
      `\\textbf{${this.escape(skill.category ?? "Skills")}{:}} ${this.escape(skill.items.join(", "))}`
  )
  .join(" \\\\\n")}
}}
\\end{itemize}
`;
  }

  private renderCertifications(certifications: StructuredResume["certifications"]): string {
    if (!certifications.length) return "";

    return `
\\section{Certifications}
\\begin{itemize}
${certifications
  .map(
    (c) =>
      `\\item ${this.escape(c.name)}${c.issuer ? ` -- \\textit{${this.escape(c.issuer)}}` : ""}${c.issueDate ? ` (${this.escape(c.issueDate)})` : ""}`
  )
  .join("\n")}
\\end{itemize}
`;
  }

  private renderAchievements(achievements: string[]): string {
    if (!achievements.length) return "";

    return `
\\section{Achievements}
${this.renderBullets(achievements)}
`;
  }

  private renderAdditionalSections(sections: NonNullable<StructuredResume["additionalSections"]>): string {
    if (!sections.length) return "";

    return sections
      .map(
        (section) => `
\\section{${this.escape(section.title)}}
${this.renderBullets(section.items)}
`
      )
      .join("\n");
  }

  private renderBullets(bullets?: string[]): string {
    if (!bullets?.length) return "";

    return `
\\begin{itemize}
${bullets.map((bullet) => `\\item ${this.escape(bullet)}`).join("\n")}
\\end{itemize}
`;
  }

  private escape(value?: string): string {
    if (!value) return "";

    return value
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/&/g, "\\&")
      .replace(/%/g, "\\%")
      .replace(/\$/g, "\\$")
      .replace(/#/g, "\\#")
      .replace(/_/g, "\\_")
      .replace(/{/g, "\\{")
      .replace(/}/g, "\\}")
      .replace(/~/g, "\\textasciitilde{}")
      .replace(/\^/g, "\\textasciicircum{}");
  }
}