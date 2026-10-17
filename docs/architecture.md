# Architecture

This repository packages a small Notes workload as a training example for application tests, container images, and a temporary Compose deployment. It is not a persistent production service.

## Components and request flow

```text
Browser or curl
      |
      | HTTP :8080
      v
Angular static build served by Nginx
      |                         \
      | /api/*                   \ /actuator/*
      v                            v
Spring Boot API :8080  <-----------+
      |
      | JDBC
      v
PostgreSQL :5432
```

- `frontend/` is a standalone Angular app. `NotesApiService` calls relative `/api/notes` URLs so the same build can use the Nginx proxy in local and release Compose.
- `frontend/nginx.conf` serves the single-page app and proxies `/api/` and `/actuator/` to the Compose service named `backend`.
- `backend/` is a Spring Boot REST API. The controller delegates to a service and Spring Data JPA repository; Flyway owns schema creation and Hibernate validates the resulting schema.
- `database` is PostgreSQL with a named Compose volume. The app service waits for the database health check before starting.
- The release Compose file contains prebuilt image references only. It does not build application images.

## API contract

The collection resource is `/api/notes`:

| Method | Path | Result |
| --- | --- | --- |
| `GET` | `/api/notes` | Notes ordered by ID |
| `GET` | `/api/notes/{id}` | One note; `404` if absent |
| `POST` | `/api/notes` | Create a note; returns `201` and a `Location` header |
| `PUT` | `/api/notes/{id}` | Replace a note's title and content; `404` if absent |
| `DELETE` | `/api/notes/{id}` | Delete a note; returns `204` |

Both `title` and `content` are required and must not be blank. Their maximum lengths are 120 and 10,000 characters respectively. Invalid request data is handled as a client error. The UI applies the same required and maximum-length constraints.

Actuator exposes `health` and `info`; the health endpoint is used by the backend health check and proxied through Nginx for acceptance testing.

## Build and delivery flow

`.github/workflows/ci-cd.yml` is configured for pushes to `main` and manual dispatch. It runs backend and frontend quality jobs in parallel. The image job requires both, builds and scans both images, then publishes them to Docker Hub. A final job pulls the generated version using `deploy/compose.yaml`, waits for healthy services, and runs `scripts/smoke-test.sh`; it then removes the temporary Compose project and database volume.

The workflow version is `1.0.${{ github.run_number }}`. Deployment uses that exact version rather than `latest`, but rerunning a workflow run reuses its run number; tags are therefore not guaranteed immutable.

See [Current state](current-state.md) for evidence boundaries and known limitations, and [Operations](operations.md) for commands.
