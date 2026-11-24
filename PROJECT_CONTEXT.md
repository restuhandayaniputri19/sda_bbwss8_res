# PROJECT_CONTEXT.md

## 1. Project Overview

Existing web application for public services and information management.

Main modules include:
- Layanan Terpadu
- Aplikasi
- Infografis
- Galeri
- Banner

This is a legacy project undergoing gradual development and modernization.

The priority is to implement new requirements while preserving existing functionality.

## 2. Technology Stack

### Backend
- Hono — active API framework
- SQLite — database
- Drizzle ORM — schema, queries, and migrations

### Frontend
- React.js
- React Router
- Tailwind CSS
- Lucide React

## 3. Repository Structure

```text
project/
├── backend/                 # Legacy backend (no longer used)
│
├── backend2/                # Active backend
│   ├── uploads/
│   │   └── <module-or-app>/
│   ├── ...                  # Hono application
│   └── ...
│
├── frontend/                # React application
│   ├── features/
│   ├── hooks/
│   ├── services/
│   ├── routes/
│   └── ...
│
└── PROJECT_CONTEXT.md
```

### Important Directory Rules

- `backend/` is the old backend and is no longer actively used.
- `backend2/` is the active backend. All new backend changes must be made here.
- `frontend/` is the active React application.
- Do not modify legacy backend code unless explicitly requested.

## 4. Backend Conventions

### Framework and Database
- Use Hono for API endpoints.
- Use SQLite as the database.
- Use Drizzle ORM for database operations.
- Follow existing route, schema, and query conventions.

### Authentication
- API authentication uses Bearer tokens.
- Follow the existing authentication middleware and authorization patterns.
- Do not introduce a different authentication mechanism.

### File Uploads

Uploaded files are stored under:

```text
backend2/uploads/<module-or-app>/
```

Files are served statically using:

```text
/api/uploads/<module-or-app>/<filename>
```

Follow existing upload handling, validation, and static file serving conventions.

Do not introduce another upload directory or storage mechanism without explicit requirements.

## 5. Frontend Conventions

The frontend is a React.js application.

Existing directory responsibilities:

- `features/`: feature-specific pages and components.
- `hooks/`: reusable React hooks and data access hooks.
- `services/`: API clients and service functions.
- `routes/`: application routing.

Follow the existing separation of responsibilities.

Before creating new files, inspect existing implementations and reuse existing patterns.

## 6. Development Principles

### Requirement First
- Implement explicitly requested requirements.
- Do not introduce unrelated improvements.
- Avoid speculative features.

### Minimal Changes
- Prefer the smallest correct implementation.
- Preserve existing project structure.
- Avoid unnecessary refactoring.
- Do not modify unrelated modules.

### Legacy Code Awareness
- Understand existing data flow before making changes.
- Trace the flow from React UI through hooks and services to Hono API and SQLite.
- Do not assume similarly named modules have identical behavior.

### Database
- Use Drizzle ORM.
- Consider existing records and backward compatibility.
- Follow existing migration conventions.
- Do not rename or remove existing columns without explicit requirements.

### Frontend
- Use React functional components and hooks.
- Follow existing React Router conventions.
- Use Lucide React for icons.
- Reuse existing components and API hooks.
- Handle loading, error, and empty states.

## 7. Working Procedure

Before implementation:

1. Inspect relevant source files.
2. Identify the existing UI-to-backend flow.
3. Inspect related database schemas.
4. Identify all affected files.
5. Understand existing conventions.
6. Implement only the required changes.

After implementation:

1. Summarize modified files.
2. Explain database changes and migrations.
3. Report tests or checks performed.
4. Mention anything not verified.

## 8. Current Development Scope

Current focus: Layanan Terpadu.

Specific feature requirements should be documented separately.

Do not assume future requirements have already been approved.

## 9. Instructions for Codex

Act as a developer working on an existing project.

- Inspect before editing.
- Do not guess file locations or implementation conventions.
- Do not modify `backend/`.
- Use `backend2/` for active backend development.
- Preserve the existing frontend architecture.
- Avoid broad refactoring unless explicitly requested.
- Ask for clarification when a requirement is ambiguous or could affect unrelated functionality.

## 10. Deployment and Docker

The application is deployed using Docker.

Each application has its own Dockerfile:

- `backend2/Dockerfile` — Hono backend.
- `frontend/Dockerfile` — React frontend.

### Docker Guidelines

- Keep backend and frontend Docker configurations separate.
- When modifying dependencies or build processes, inspect the corresponding Dockerfile.
- Ensure application changes remain compatible with their Docker build environments.
- Do not modify Docker configurations unless required.
- Do not assume local development and Docker runtime environments are identical.
- When changes affect deployment, verify the relevant Docker build if possible.

