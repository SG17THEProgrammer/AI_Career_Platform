export interface StructuredResume {
  basics: {
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    summary?: string;
  };

  skills: {
    category?: string;
    items: string[];
  }[];

  experience: {
    company: string;
    title: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    achievements: string[];
    technologies?: string[];
  }[];

  education: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    cgpa?: string;
  }[];

  projects: {
    name: string;
    description?: string;
    achievements: string[];
    technologies?: string[];
    link?: string;
  }[];

  certifications: {
    name: string;
    issuer?: string;
    issueDate?: string;
    credentialId?: string;
    url?: string;
  }[];

  achievements: string[];

  additionalSections?: {
    title: string;
    items: string[];
  }[];
}