# Database

MongoDB Atlas is the primary database.

Initial collections:

- `users`
- `master_resumes`
- `tailored_resumes`
- `ats_analyses`
- `research_documents`
- `prep_workspaces`
- `question_sets`
- `attempt_sessions`
- `learning_progress`
- `discovered_jobs`
- `async_jobs`
- `audit_logs`
- `system_settings`

## `master_resumes`

Important fields:

- `userId`
- `ownerType`
- `displayName`
- `originalFileName`
- `fileUrl`
- `storageProvider`
- `storagePublicId`
- `fileSizeBytes`
- `mimeType`
- `parsedText`
- `normalizedText`
- `fingerprint`
- `metadata`
- `lastUsedAt`
- `deletedAt`

Create a unique active-resume index on `{ userId, fingerprint }` so duplicate uploads are rejected per user.
