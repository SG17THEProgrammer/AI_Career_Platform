# Repository Guidelines

## Product Identity & Scope

**AI Resume Tailor and Prep** is an AI-powered career preparation platform: resume management, ATS resume tailoring, company/interview research, practice workspaces, learning analytics, and mobile quick revision in one system.

The product is not a job board, mock interviewer, LeetCode clone, or resume builder from scratch. It starts from user-provided resumes and job descriptions, then helps users tailor, research, prepare, practice, track progress, and revise before interviews.

Core philosophy:

- **Desktop-first creation:** resume upload, tailoring, research generation, admin review, and deep workspace setup are optimized for desktop.
- **Mobile-first consumption:** practice, review, bookmarks, progress, flashcards, weak topics, STAR stories, and last-minute revision are optimized for mobile.

## Roles & Permissions

Normal users can register/login, upload and manage resumes, paste job descriptions, generate ATS analysis, generate tailored resumes, create interview research, generate practice questions, complete MCQ/subjective/timed sessions, bookmark items, and view learning progress.

Admins can do everything users can, plus run and monitor daily job discovery, manage the jobs database, trigger crawlers/research, view system metrics, view users, review audit logs, and manage admin pipeline statuses.

Keep admin-only capabilities hidden from normal users. Normal users must not access job discovery, crawlers, the admin dashboard, or the global jobs database.

## Primary Workflows

Everything should orbit this user workflow:

```text
Resume
+ Job Description
-> ATS Analysis
-> Tailored Resume
-> Interview Research
-> Prep Workspace
-> Question Generation
-> Practice Sessions
-> Learning Progress
-> Mobile Revision
```

Admin job discovery runs separately:

```text
Daily Cron at 08:00 AM
-> Serper + Tavily
-> Collect Jobs
-> Deduplicate
-> Rank
-> Store
-> Admin Review
```

Target admin-discovered roles are AI Engineer, Software Engineer, Full Stack Engineer, and AI Product Engineer for 0-1 years of experience. Sources include LinkedIn, Wellfound, Greenhouse, Lever, YC Jobs, and company career pages.

## Project Structure & Module Organization

Use a modular monolith in a TypeScript monorepo:

```text
apps/
  web/          # Next.js frontend
  api/          # Express API and workers
packages/
  shared-types/
  eslint-config/
  ts-config/
docs/
  PRD.md
  ARCHITECTURE.md
  DATABASE.md
  API_SPEC.md
  WORKFLOWS.md
  ROADMAP.md
  DECISIONS.md
assets/
tests/
```

Backend code should follow this structure inside the API app:

```text
src/
  app/              # Express bootstrap, middleware, routing
  config/           # Environment and SDK configuration
  modules/          # Vertical business domains
  shared/           # DTOs, errors, utilities, logger
  infrastructure/   # Database, queue, AI, search, storage, PDF, cache
  workers/          # BullMQ processors
  scripts/
  types/
  index.ts
```

Core backend modules:

- `auth`
- `users`
- `resumes`
- `ats`
- `research`
- `prep`
- `learning`
- `async-jobs`
- `discovered-jobs`
- `admin`
- `system-settings`

Shared infrastructure modules:

- `ai`
- `search`
- `queue`
- `storage`
- `pdf`
- `cache`
- `logger`

Workers:

- `resume-parsing`
- `ats-analysis`
- `resume-tailoring`
- `research-generation`
- `question-generation`
- `cleanup`

## Architecture Rules

Use a modular monolith. Do not introduce microservices, Kubernetes, Kafka, CrewAI, AutoGen, or broad LangChain usage.

Keep module boundaries strict:

- Controllers call services.
- Services call repositories and infrastructure adapters.
- Repositories are dumb data gateways.
- Repositories must not call business services, AI providers, search APIs, or queues.
- Avoid direct database cross-access between modules. For example, `ResearchService` should request resume data through `ResumeService` or an explicit public repository interface, not by querying `ResumeModel` directly.
- Keep parsing, scoring, generation, persistence, PDF compilation, and UI concerns separated.
- Use provider abstractions for AI and search so implementations can be swapped later.

Use LangGraph selectively only for the research pipeline and interview prep pipeline. Do not use it everywhere.

## Frozen Tech Stack

Frontend:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query

Backend:

- Node.js
- Express.js
- TypeScript

Data and infrastructure:

- MongoDB Atlas
- BullMQ
- Upstash Redis
- Cloudinary
- Local XeLaTeX PDF compilation
- Pino logging
- Sentry later for monitoring

AI and search:

- Groq only, behind an AI provider abstraction
- Tavily and Serper behind a unified search abstraction

Deployment:

- Frontend on Vercel
- Backend and workers on Railway
- Database on MongoDB Atlas
- Redis on Upstash
- Storage on Cloudinary

Explicitly rejected for phase 1:

- Microservices
- Kubernetes
- Kafka
- Pinecone
- Qdrant
- PostgreSQL
- CrewAI
- AutoGen
- LangChain everywhere
- Overleaf API

## Domain Model & Persistence

Everything important must be persisted:

- Master resumes
- Tailored resumes
- ATS analyses
- Original PDFs
- Compiled PDFs
- LaTeX source
- Research documents
- Prep workspaces
- Question banks
- Answers
- Bookmarks
- Attempt sessions
- Learning progress
- Job history
- Async jobs
- Audit logs

Primary MongoDB collections:

- `users`
- `master_resumes`
- `tailored_resumes`
- `ats_analyses`
- `research_documents`
- `prep_workspaces`
- `question_sets`
- `attempt_sessions`
- `learning_progress`
- `jobs` or `discovered_jobs`
- `async_jobs`
- `audit_logs`
- `system_settings`

Every major document should include an ownership model:

```text
ownerType: "user" | "admin" | "system"
```

Use this consistently for authorization, analytics, and auditing.

## Resume Management

Users can upload and manage multiple master resumes. Do not force labels like "AI Resume" or "Full Stack Resume"; users choose names/labels when needed.

Resume upload pipeline:

```text
PDF
-> Text Extraction
-> Normalization
-> Fingerprint
-> Duplicate Check
-> Store Original PDF + Parsed Text + Metadata
```

Selection logic:

- If a user has one resume, auto-select it.
- If a user has multiple resumes, require manual selection.
- Do not use AI resume recommendation in phase 1.
- Store `lastUsedResume`.

## ATS Tailoring Rules

The ATS tailoring engine is a main differentiator. It must never hallucinate.

Never invent:

- Projects
- Companies
- Experience
- Skills
- Certifications
- Metrics
- Technologies

Allowed:

- Rewrite existing bullets for clarity and role alignment.
- Reorder sections or projects to prioritize relevant experience.
- Expand existing abbreviations and keyword variants, such as `RAG` to `Retrieval-Augmented Generation (RAG)`.
- Inject keywords only when the underlying skill or fact already exists in the resume.

Optimize for:

- Skill matching
- Keyword matching
- Bullet rewriting
- Section reordering
- Resume structure

Do not show fake ATS scores. Prefer evidence-based analysis: matched skills, missing skills, keywords added, section changes, and reasoning.

Tailored resume pipeline:

```text
Resume
-> Parse
-> Extract Facts
-> Freeze Facts
-> Analyze JD
-> Match Skills
-> Rewrite Bullets
-> Reorder Sections
-> Generate Resume
-> Generate LaTeX
-> Compile PDF
-> Store
```

Each tailored resume should store the target job description, ATS analysis summary, matched skills, missing skills, keywords added, section changes, LaTeX source, compiled PDF URL, and creation metadata.

## Interview Research & Prep

Research is generated from resume, tailored resume, job description, company, recent news, hiring patterns, and interview experiences.

Research should include:

- Company mission, products, tech stack, competitors, and funding when available.
- Interview patterns, common questions, hiring process, and technical focus areas.

Prep workspaces are generated from:

```text
Resume
+ Tailored Resume
+ Job Description
+ Research
```

Use dynamic question banks. Do not hardcode a fixed 80-question system. Question count should depend on role complexity, JD breadth, and user experience level. A workspace may have 60, 100, 150, or another appropriate number of questions.

Approximate adaptive question distribution:

- Technical: 60-70%
- Resume deep dive: 15-20%
- Company: 10-15%
- Behavioral: 5-10%

Question types:

- MCQs for practice, scoring, and timed assessments.
- Subjective questions for interview preparation, communication practice, and explanation skills.

Learning mode includes MCQs and subjective questions. It must support resumable sessions, bookmarks, saved progress, weak areas, category scores, and explanations.

Simulation mode is MCQ-only. It must support a timer, auto-submit, score, accuracy, and history.

Learning analytics update after MCQ practice, subjective practice, and timed assessments. Track accuracy, weak areas, progress trends, topic performance, completed sessions, and last activity.

## Mobile Quick Revision

Last Minute Revision Mode is important and should be optimized for mobile and quick loading.

It should show:

- Weak topics
- Notes
- Flashcards
- Frequently asked questions
- STAR stories
- Company facts

Design for 5-minute interview revision on small screens, including 375px-wide viewports, touch-friendly controls, bottom navigation where appropriate, and fast skeleton/cached loading.

## Database Shape Guidance

Useful starting schemas:

- `users`: email, passwordHash, role, createdAt.
- `master_resumes`: userId, fileUrl, parsedText, fingerprint, metadata, upload date.
- `tailored_resumes`: masterResumeId, userId, targetJobDescription, atsAnalysisSummary, latexSourceCode, compiledPdfUrl, createdAt.
- `discovered_jobs`: jobTitle, companyName, jobDescriptionText, applicationSourceUrl, pipelineStatus, discoveryTimestamp.
- `prep_workspaces`: userId, associatedResumeId, targetJobDescription, companyResearchId, createdAt.
- `question_sets`: workspaceId, generationType, questions with UUID, type, category, difficulty, prompt, options, correct answer, ideal answer, explanation.
- `attempt_sessions`: userId, questionSetId, completion state, timer fields, responses, completedAt.
- `learning_progress`: userId, overall accuracy, weak topics, completed sessions count, lastActiveTimestamp.

Job pipeline statuses:

```text
NEW -> REVIEWING -> TAILORED -> APPLIED -> INTERVIEWING -> REJECTED -> OFFER
```

## Build, Test, and Development Commands

No build system is committed yet. When tooling is introduced, document canonical commands here and keep them runnable from the repository root.

Expected command patterns:

- `npm install` to install monorepo dependencies.
- `npm run dev` to run local web/API development.
- `npm test` to run the full test suite.
- `npm run lint` to check style.
- `npm run typecheck` to validate TypeScript.

Avoid multiple competing command paths for the same workflow.

## Coding Style & Naming Conventions

Use clear domain names tied to resume tailoring, interview preparation, learning analytics, and admin job discovery.

Conventions:

- TypeScript files and folders should use predictable domain names.
- Use `camelCase` for variables/functions.
- Use `PascalCase` for classes, React components, and TypeScript types.
- Use 2 spaces for TypeScript, JavaScript, JSON, YAML, and CSS.
- Use environment variables for all credentials and provider keys.

Keep functions focused, validate external inputs, and prefer structured parsers/APIs over ad hoc string manipulation when possible.

## Testing Guidelines

Place tests near the relevant app/package or in `tests/` when a cross-cutting suite is clearer. Test names should describe behavior, such as `resumeParser.test.ts`, `jobMatcher.test.ts`, or `atsTailoring.test.ts`.

Cover core flows:

- Resume ingestion and duplicate detection
- Job description parsing
- ATS analysis
- Fact freezing and no-hallucination tailoring
- LaTeX/PDF generation
- Research generation
- Question generation
- Attempt sessions
- Learning progress updates
- Admin-only authorization

Add regression tests for bugs before fixing them when practical.

## Documentation Guidelines

Keep the planning docs current as implementation decisions become real:

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`
- `docs/API_SPEC.md`
- `docs/WORKFLOWS.md`
- `docs/ROADMAP.md`
- `docs/DECISIONS.md`

Document any deviation from the frozen stack or rejected technologies in `docs/DECISIONS.md` before implementing it.

## Roadmap

Milestone 1: launchable MVP.

1. Environment skeleton and auth.
2. Resume module.
3. ATS analysis.
4. Tailored resume generation.
5. Research generation.
6. Prep workspace foundation.

Milestone 2:

1. Question generation.
2. Attempts and timed assessments.
3. Learning system.
4. Mobile/PWA quick revision.
5. Admin job discovery and tracking.
6. Production hardening.

## Security & Configuration

Never commit API keys, candidate resumes, job postings containing private data, generated personal documents, compiled personal PDFs, or real `.env` files.

Use `.env.example` for documented configuration keys. Keep only sanitized examples in `assets/samples/` when needed.

Protect private documents with strict ownership checks. Admin capabilities require explicit `requireAdmin` middleware. User capabilities require `requireAuth` and per-document authorization.

Use Pino for structured logs, but avoid logging raw resumes, job descriptions with private data, generated personal documents, access tokens, passwords, or provider secrets.

## Commit & Pull Request Guidelines

Use concise imperative commit messages, such as `Add resume parser scaffold` or `Document local setup`.

Pull requests should include a short summary, test results, linked issues when relevant, and screenshots or sample output for UI, PDF, or document-generation changes.
