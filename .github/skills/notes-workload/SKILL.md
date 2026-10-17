---
name: notes-workload
description: Use when changing or documenting the Notes API, persistence, Angular UI, or their tests in this repository.
---

# Notes workload

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

The backend integration test needs Docker for PostgreSQL Testcontainers. Report environment failures separately from application failures; never disable or weaken the integration test just to make a local run green.
