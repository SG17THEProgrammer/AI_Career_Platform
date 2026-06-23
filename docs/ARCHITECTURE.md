# Architecture

The application is a TypeScript modular monolith in an npm workspace monorepo.

- `apps/web`: Next.js frontend.
- `apps/api`: Express API and BullMQ workers.
- `packages/shared-types`: shared domain types.

Backend flow is `Controller -> Service -> Repository -> Database`. Cross-module database access should happen through explicit services or public repository interfaces.
