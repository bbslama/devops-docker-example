---
name: notes-workload
description: Use when changing or documenting the Notes API, persistence, Angular UI, or their tests in this repository.
---

# Notes workload

## Start and prerequisites

Before work, inspect `AGENTS.md`, `docs/current-state.md`, the requested roadmap milestone, and the relevant source/tests below. Confirm whether the user requested planning, implementation, or validation and keep changes to that scope.

## Source of truth

- Backend code and tests are under `backend/src/`; Maven configuration and quality checks are in `backend/pom.xml`.
- Flyway owns schema changes under `backend/src/main/resources/db/migration/`. Hibernate is configured to validate the schema, not create it.
- Frontend code and tests are under `frontend/src/`; npm scripts are defined in `frontend/package.json`.
- The frontend uses relative `/api/notes` paths. `frontend/nginx.conf` proxies `/api/` and `/actuator/` to the Compose `backend` service.

## Contract and conventions

- Notes require a nonblank title (maximum 120 characters) and content (maximum 10,000 characters); keep API and UI validation aligned.
- REST routes are `GET /api/notes`, `GET /api/notes/{id}`, `POST /api/notes`, `PUT /api/notes/{id}`, and `DELETE /api/notes/{id}`.
- Preserve the controller/service/repository separation. Missing IDs are reported as `404`; creates return `201` with a resource location; deletes return `204`.
- When changing a schema, add a new versioned Flyway migration; do not edit an already released migration as a shortcut.
- Add or update backend unit/controller/integration tests and frontend service/component tests for behavior changes.

## Verification

```sh
cd backend && ./mvnw --batch-mode --no-transfer-progress clean verify
cd frontend && npm ci && npm run quality
```

The backend integration test needs Docker for PostgreSQL Testcontainers. Report environment failures separately from application failures; never disable or weaken the integration test just to make a local run green. Validate the relevant tests and API contract, inspect the diff, and update current state only after actual evidence.

## Safety and stop conditions

Do not expand the app into unrelated features, add browser E2E, change migrations already released, expose secrets, or change container/workflow/cloud concerns under this skill. Stop if requirements conflict with API contract or involve data loss; ask before widening scope.

See [architecture](../../../docs/architecture.md), [definition of done](../../../docs/definition-of-done.md), and [roadmap](../../../docs/roadmap.md).

## Invocation example

Use the /notes-workload skill to change one Notes API behavior and its focused tests.
