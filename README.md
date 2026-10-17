# DevOps container delivery lab

A small Notes application exists to exercise automated tests, container builds, image publication, and temporary deployment acceptance. This repository is a DevOps lab, not a production hosting platform.

## Application and versions

| Component | Version |
| --- | --- |
| Java | 25 |
| Spring Boot | 4.1.1 |
| Maven Wrapper / Maven | 3.3.4 / 3.9.11 |
| Node.js / npm | 24.16.0 / 11.17.0 |
| Angular | 22.2.3 |
| PostgreSQL | 17.7 (Alpine image) |
| Nginx | 1.30.1 (Alpine image) |
| Testcontainers / Checkstyle / JaCoCo | 2.0.5 / 10.26.1 / 0.8.14 |
| Trivy | 0.76.0 |

The backend is a Spring Web/JPA/Validation API with Flyway migrations and Actuator health/info endpoints. The standalone Angular frontend uses reactive forms and relative `/api/notes` URLs; Nginx proxies API and Actuator requests to the backend. PostgreSQL stores notes. The API validates required titles (up to 120 characters) and content (up to 10,000 characters), and returns `400` for invalid input and `404` for missing notes.

## Repository layout

| Path | Purpose |
| --- | --- |
| `backend/` | Spring Boot API, Maven Wrapper, tests, Dockerfile |
| `frontend/` | Angular app, Vitest tests, ESLint, Dockerfile and Nginx config |
| `compose.yaml` | Local build-and-run integration stack |
| `deploy/compose.yaml` | Pull-only versioned release deployment |
| `scripts/smoke-test.sh` | Curl-based deployment acceptance check |
| `.github/workflows/ci-cd.yml` | Test, publish, temporary deploy and smoke-test pipeline |
| `docs/` | Architecture, operating instructions, and verified current status |
| `.github/skills/` | Repository-specific Agent Skills for app and delivery work |

## Local development and checks

Run backend tests, including the PostgreSQL Testcontainers integration test and Checkstyle; JaCoCo writes reports to `backend/target/site/jacoco/`:

```sh
cd backend
./mvnw clean verify
```

Install frontend dependencies and run ESLint, Vitest once, and an Angular production build:

```sh
cd frontend
npm ci
npm run quality
```

Build the two local images from the repository root:

```sh
docker build -t devops-example-backend:local ./backend
docker build -t devops-example-frontend:local ./frontend
```

Start the local integration stack using local builds:

```sh
cp deploy/.env.example deploy/.env
docker compose --env-file deploy/.env -f compose.yaml up --build -d --wait
scripts/smoke-test.sh
docker compose --env-file deploy/.env -f compose.yaml down --volumes
```

The ignored `deploy/.env` is a local-only configuration file; do not commit it. The release Compose file has no `build:` entries and only pulls images. For release consumption, set `DOCKERHUB_USERNAME`, `APP_VERSION`, `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` in the shell (or use a private local env file) and run:

```sh
docker compose -f deploy/compose.yaml pull
docker compose -f deploy/compose.yaml up -d --wait
scripts/smoke-test.sh
docker compose -f deploy/compose.yaml down --volumes
```

The smoke test waits for the frontend, checks backend health through the Nginx proxy, creates a unique note, confirms it appears in the list, and deletes it. It uses curl and shell utilities; it is not a browser or UI test.

## CI/CD delivery flow

On pushes to `main` and manual `workflow_dispatch`, the workflow runs backend verification and frontend lint/tests/build in parallel. Only after both succeed does it build and publish the backend and frontend images, then perform a temporary Compose deployment and curl smoke test on a GitHub-hosted runner. The temporary project is removed even when acceptance fails; this is not persistent production hosting.

Each run uses the shared version `1.0.${{ github.run_number }}` for both images:

- `${DOCKERHUB_USERNAME}/devops-example-backend:1.0.N`
- `${DOCKERHUB_USERNAME}/devops-example-frontend:1.0.N`

The workflow also publishes `latest` convenience aliases. Deployment uses the numbered tag, never `latest`; however, a GitHub Actions re-run reuses the same run number and can republish that numbered tag, so the workflow does not enforce immutable tags. The workflow records its generated version in the run summary, builds using Docker Buildx and GitHub Actions cache, and scans both built images with Trivy before publishing. Trivy ignores unfixed findings and fails on fixable critical vulnerabilities; a vulnerability-database download failure is reported as **BLOCKED** and prevents publication rather than being passed.

Configure these repository settings before a publish run:

- **Variable:** `DOCKERHUB_USERNAME`
- **Secret:** `DOCKERHUB_TOKEN`, a Docker Hub access token (not a Docker Hub password)

The deployment pulls only the exact version produced by that workflow. Docker Hub images need to be public for the deployment runner's anonymous pull; if the repositories are private, provide an appropriately scoped pull credential to the deploy job.

## Image policy and troubleshooting

Docker Hardened Images catalog entries exist for Maven, Node.js, Nginx, and PostgreSQL. Their exact compatible tags and pull access could not be verified in the implementation environment, so the Dockerfiles and Compose files use explicit stable upstream tags instead: Maven 3.9.11 with Eclipse Temurin 25, Temurin 25 JRE, Node 24.16.0, Nginx 1.30.1, and PostgreSQL 17.7. Recheck the DHI catalog and access before replacing these fallbacks; do not guess tags or add DHI credentials to the repository.

Useful diagnostics and cleanup:

```sh
docker compose --env-file deploy/.env -f compose.yaml ps
docker compose --env-file deploy/.env -f compose.yaml logs
docker compose --env-file deploy/.env -f compose.yaml down --volumes
```

The Compose health checks wait for PostgreSQL, the Actuator backend endpoint, and the frontend. Check Docker availability if Testcontainers cannot start PostgreSQL; check Docker Hub access and the required repository variable/secret if publication or pulls fail.

## Deferred

AWS, Terraform, persistent cloud deployment, Kubernetes, monitoring, and centralized logging are intentionally out of scope.

For a component and request-flow overview, see [Architecture](docs/architecture.md). For setup, deployment, and cleanup steps, see [Operations](docs/operations.md). For what has and has not been verified at the pushed baseline, see [Current state](docs/current-state.md).
