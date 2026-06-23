# API Specification

Initial endpoints:

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `POST /resumes`
- `GET /resumes`
- `GET /resumes/:resumeId`
- `PATCH /resumes/:resumeId/last-used`
- `DELETE /resumes/:resumeId`

Authentication uses JWT access tokens. Protected user routes must use `requireAuth`; admin routes must use `requireAdmin`.

## Resume Upload

`POST /resumes` accepts `multipart/form-data`:

- `resume`: required PDF or plain text file, max 5 MB.
- `displayName`: optional user-facing resume name.

The API extracts text, normalizes it, generates a fingerprint, rejects duplicates per user, stores the original file, and creates a `master_resumes` document.
