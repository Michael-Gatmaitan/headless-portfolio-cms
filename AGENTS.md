# Project: Job Tracker feature for existing project - fetchfolio

## Tech Stack

- Frontend (apps/web): Next.js 16, React 19, TypeScript 5.9
- Styling: Tailwind CSS v4, Shadcn 4
- Package manager: pnpm

## Agent Orchestration Roles

### [Architect Agent]

- **Responsibility:** Layer 1 (Planning schema).
- **Task:** Define the database schema for the Job Tracker feature.
- **Fields required:** company name, role, location, salary range, status, notes, platform (linkedin, indeed, glassdoor, etc.), date_applied.

### [Backend Agent]

- **Responsibility:** Layer 2 (API & Database).
- **Task:** Implement CRUD operations for Job Tracker inside `apps/api/src`.
- **Constraint:** Follow existing API patterns. Export TypeScript types for the frontend to consume.

### [Frontend Agent]

- **Responsibility:** Layer 3 (UI Components).
- **Task:** Build views inside `apps/web`.
- **Required UI:** `data-table` for listing jobs, an edit form, and a confirmation dialog for deletion.

## Code Style

- Always use shadcn components when creating new UI elements.
- Always TypeScript; strict mode enabled; no `any`.
- Named exports only; no default exports except Next.js pages/layouts.
- Functional components only; no class components.
- Server Components (RSC) by default; `'use client'` only for state or browser APIs.
- Prefer `const` arrow functions for components and pure utilities.
- Max function length: 40 lines. Max nesting: 2 levels.

## Directory Instructions

- **Frontend Components:** `apps/web/components/layout/job-tracker/` (Create folder if missing). Store sub-components here.
- **Backend Core:** `apps/api/src/` (Follow existing architecture strictly).

## Security

- Never hardcode secrets; use environment variables only.
- Ask for user approval before executing any destructive shell commands.
- Never read `.env` files or output their contents.

## Communication & Guardrails

- Be concise. No preamble.
- List every file you plan to modify before editing.
- If a change touches more than 3 files, stop and ask for user approval first.
- Summarise completed multi-step tasks in exactly 3 bullet points.
