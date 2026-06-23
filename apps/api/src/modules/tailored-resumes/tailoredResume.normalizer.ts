import { StructuredResume } from "../resumes/resume.types.js";

type AnyObject = Record<string, any>;

export function normalizeTailoredResume(
  content: unknown
): StructuredResume {
  const data = isObject(content) ? content : {};

  return {
    basics: normalizeBasics(data.basics),
    skills: normalizeSkills(data.skills),
    experience: normalizeExperience(data.experience),
    education: normalizeEducation(data.education),
    projects: normalizeProjects(data.projects),
    certifications: normalizeCertifications(data.certifications),
    achievements: normalizeAchievements(data.achievements),
    additionalSections: normalizeAdditionalSections(data.additionalSections),
  };
}

function normalizeBasics(basics: unknown) {
  const data = isObject(basics) ? basics : {};
  return {
    name: getString(data.name, data.fullName, data.candidateName),
    title: getString(data.title, data.role, data.position, data.headline),
    email: getString(data.email),
    phone: getString(data.phone, data.mobile, data.phoneNumber),
    location: getString(data.location, data.city, data.address),
    linkedin: getString(data.linkedin, data.linkedinUrl),
    github: getString(data.github, data.githubUrl),
    portfolio: getString(data.portfolio, data.website, data.personalWebsite),
    summary: getString(
      data.summary,
      data.professionalSummary,
      data.profileSummary,
      data.objective,
      data.about
    ),
  };
}

function normalizeSkills(skills: unknown) {
  if (!Array.isArray(skills)) return [];
  if (skills.length === 0) return [];

  if (skills.every((s) => typeof s === "string")) {
    return [{ category: "Technical Skills", items: dedupeStrings(skills) }];
  }

  return skills
    .map((skill) => {
      if (typeof skill === "string") {
        return { category: "Technical Skills", items: [skill] };
      }
      if (!isObject(skill)) return null;

      let items: string[] = [];

      if (Array.isArray(skill.items)) {
        items = dedupeStrings(skill.items);
      } else if (Array.isArray(skill.skills)) {
        items = dedupeStrings(skill.skills);
      } else if (Array.isArray(skill.technologies)) {
        items = dedupeStrings(skill.technologies);
      } else if (typeof skill.items === "string") {
        // EXPLICITLY SPLIT ON COMMAS FOR SKILLS ONLY
        items = skill.items.split(/,|\n|•|◦|/).map((s) => s.trim()).filter(Boolean);
      }

      return {
        category: getString(skill.category, skill.name, skill.title),
        items,
      };
    })
    .filter(Boolean)
    .filter((s) => s!.items.length > 0) as StructuredResume["skills"];
}

function normalizeExperience(experience: unknown): StructuredResume["experience"] {
  if (!Array.isArray(experience)) return [];

  return experience
    .map((exp) => {
      if (!isObject(exp)) return null;
      const dates = normalizeDateRange(exp);

      return {
        company: getString(exp.company, exp.employer, exp.organization, exp.client),
        title: getString(exp.title, exp.position, exp.role, exp.jobTitle),
        location: getString(exp.location),
        startDate: dates.startDate,
        endDate: dates.endDate,
        current: dates.current,
        achievements: normalizeStringArray(
          exp.achievements,
          exp.bullets,
          exp.responsibilities,
          exp.points,
          exp.description
        ),
        technologies: normalizeStringArray(
          exp.technologies,
          exp.techStack,
          exp.skills,
          exp.tools
        ),
      };
    })
    .filter(Boolean)
    .filter(
      (exp) => exp!.company || exp!.title || exp!.achievements.length
    ) as StructuredResume["experience"];
}

function normalizeEducation(education: unknown): StructuredResume["education"] {
  if (!Array.isArray(education)) return [];

  return education
    .map((edu) => {
      if (!isObject(edu)) return null;
      const dates = normalizeDateRange(edu);

      return {
        institution: getString(edu.institution, edu.school, edu.university, edu.college),
        degree: getString(edu.degree, edu.qualification),
        fieldOfStudy: getString(edu.fieldOfStudy, edu.field, edu.major, edu.specialization),
        startDate: dates.startDate,
        endDate: dates.endDate,
        cgpa: getString(edu.cgpa, edu.gpa, edu.grade, edu.percentage),
      };
    })
    .filter(Boolean)
    .filter((edu) => edu!.institution || edu!.degree) as StructuredResume["education"];
}

function normalizeProjects(projects: unknown): StructuredResume["projects"] {
  if (!Array.isArray(projects)) return [];

  return projects
    .map((project) => {
      if (!isObject(project)) return null;

      return {
        name: getString(project.name, project.title, project.projectName),
        description: getString(project.description, project.summary),
        achievements: normalizeStringArray(
          project.achievements,
          project.bullets,
          project.points,
          project.description
        ),
        technologies: normalizeStringArray(
          project.technologies,
          project.techStack,
          project.skills,
          project.tools
        ),
        link: getString(project.link, project.url, project.github, project.website),
      };
    })
    .filter(Boolean)
    .filter(
      (project) => project!.name || project!.description || project!.achievements.length
    ) as StructuredResume["projects"];
}

function normalizeCertifications(certifications: unknown): StructuredResume["certifications"] {
  if (!Array.isArray(certifications)) return [];

  return certifications
    .map((cert) => {
      if (typeof cert === "string") return { name: cert };
      if (!isObject(cert)) return null;

      return {
        name: getString(cert.name, cert.title, cert.certification),
        issuer: getString(cert.issuer, cert.organization, cert.provider),
        issueDate: getString(cert.issueDate, cert.date),
        credentialId: getString(cert.credentialId, cert.id),
        url: getString(cert.url, cert.link),
      };
    })
    .filter(Boolean)
    .filter((cert) => cert!.name) as StructuredResume["certifications"];
}

function normalizeAchievements(achievements: unknown): string[] {
  return normalizeStringArray(achievements);
}

function normalizeAdditionalSections(sections: unknown): StructuredResume["additionalSections"] {
  if (!Array.isArray(sections)) return [];

  return sections
    .map((section) => {
      if (!isObject(section)) return null;
      return {
        title: getString(section.title, section.name),
        items: normalizeStringArray(section.items, section.points, section.values),
      };
    })
    .filter(Boolean) as StructuredResume["additionalSections"];
}

function normalizeDateRange(data: AnyObject) {
  let startDate = getString(data.startDate, data.from);
  let endDate = getString(data.endDate, data.to);
  let current = Boolean(data.current) || Boolean(data.present);
  const dates = getString(data.dates, data.duration, data.period);

  if (dates) {
    const parts = dates.split("-").map((x) => x.trim());
    if (parts.length >= 2) {
      startDate ||= parts[0];
      const end = parts[1];
      if (/present|current|now/i.test(end!)) {
        current = true;
        endDate = undefined;
      } else {
        endDate ||= end;
      }
    }
  }

  return { startDate, endDate, current };
}

function normalizeStringArray(...values: unknown[]): string[] {
  const result: string[] = [];
  for (const value of values) {
    if (!value) continue;
    if (typeof value === "string") {
      result.push(...splitString(value));
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") {
          result.push(item.trim());
        }
      }
    }
  }
  return dedupeStrings(result);
}

function splitString(value: string) {
  return value
    .split(/\n|•|◦|/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function dedupeStrings(values: string[]): string[] {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))];
}

function getString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function isObject(value: unknown): value is AnyObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ==========================================
// NEW FUNCTIONS: ADD THESE AT THE BOTTOM
// ==========================================

export function sanitizeResumeData(resume: StructuredResume): StructuredResume {
  return {
    ...resume,
    experience: resume.experience?.map((exp) => ({
      ...exp,
      achievements: reconstructPdfBullets(exp.achievements),
    })),
    projects: resume.projects?.map((proj) => ({
      ...proj,
      achievements: reconstructPdfBullets(proj.achievements),
    })),
  };
}

function reconstructPdfBullets(fragments: string[]): string[] {
  if (!fragments || fragments.length === 0) return [];
  
  const reconstructed: string[] = [];
  let currentBullet = "";

  for (let i = 0; i < fragments.length; i++) {
    let frag = fragments[i]?.replace(/^[-•◦\s]+/, "").trim();
    if (!frag) continue;

    if (!currentBullet) {
      currentBullet = frag;
      continue;
    }

    const endsWithPunctuation = /[.!?]$/.test(currentBullet.trim());
    const startsWithLowercase = /^[a-z]/.test(frag);
    const startsWithNumber = /^[0-9]/.test(frag); 
    const endsWithHyphen = /-$/.test(currentBullet.trim());

    if (endsWithHyphen) {
      currentBullet = currentBullet.replace(/-$/, "") + "-" + frag;
    } 
    else if (!endsWithPunctuation || startsWithLowercase || (startsWithNumber && !endsWithPunctuation)) {
      currentBullet += " " + frag;
    } 
    else {
      reconstructed.push(currentBullet);
      currentBullet = frag;
    }
  }

  if (currentBullet) {
    reconstructed.push(currentBullet);
  }

  return reconstructed;
}