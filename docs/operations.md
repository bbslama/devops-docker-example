# Operations

Commands here are intended for local training or temporary acceptance environments. They are not production deployment guidance.

## Prerequisites

- Docker Engine and Docker Compose v2.
- Java 25 and the included Maven Wrapper for local backend verification.
- Node.js 24 and npm for local frontend checks.
- For Docker Hub publication, configure the repository variable `DOCKERHUB_USERNAME` and secret `DOCKERHUB_TOKEN`.

Do not put credentials in tracked files. `deploy/.env.example` is a template; a local `deploy/.env` is ignored by Git.

## Run quality checks

```sh
cd backend
./mvnw --batch-mode --no-transfer-progress clean verify

cd ../frontend
npm ci
npm run quality
```

Backend verification includes unit/controller tests, the PostgreSQL Testcontainers integration test, Checkstyle, and JaCoCo report generation. Frontend quality runs ESLint, Vitest once, and a production Angular build.

## Local build-and-run stack

Create a local environment file from the example and replace its sample password with a local-only value:

```sh
cp deploy/.env.example deploy/.env
```

From the repository root:

```sh
docker compose --env-file deploy/.env -f compose.yaml up --build -d --wait
scripts/smoke-test.sh
docker compose --env-file deploy/.env -f compose.yaml ps
docker compose --env-file deploy/.env -f compose.yaml logs
docker compose --env-file deploy/.env -f compose.yaml down --volumes
```

The last command removes the named database volume and its training data. Use it only when that data can be discarded.

## Pull-only release Compose

Set these environment variables in the shell or through a private, ignored environment file:

| Variable | Purpose |
| --- | --- |
| `DOCKERHUB_USERNAME` | Namespace containing both application images |
| `APP_VERSION` | Exact tag shared by frontend and backend |
| `POSTGRES_DB` | Database name |
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password |

Then run:

```sh
docker compose -f deploy/compose.yaml pull
docker compose -f deploy/compose.yaml up -d --wait
scripts/smoke-test.sh
docker compose -f deploy/compose.yaml ps
docker compose -f deploy/compose.yaml logs
docker compose -f deploy/compose.yaml down --volumes
```

`deploy/compose.yaml` references images and has no build instructions. The workflow's deploy job does not log in to Docker Hub; its images must be anonymously pullable unless the workflow is intentionally changed to provide pull credentials.

## Smoke-test coverage

The script waits for the frontend, checks `UP` through the proxied Actuator health endpoint, creates a uniquely named note, verifies it in the list, and deletes it. It requires `curl`, `grep`, `sed`, and a POSIX shell. A trap attempts to delete a created note if a later assertion fails.

This is an HTTP API acceptance check, not a browser test. For local environments where the host's HTTP proxy intercepts loopback traffic, use an appropriate local proxy bypass or run the script from a container on the Compose network; do not interpret an environment-specific host-port timeout as proof that the GitHub-hosted deployment works or fails.

## Workflow and external prerequisites

The workflow only runs automatically on `main`; pushes to a feature branch such as `devops-pipeline` do not match that push trigger. A manual dispatch is separately configured. A successful local test or a pushed branch does not establish that an Actions run occurred, that its credentials are configured, or that images were published and pulled. See [Current state](current-state.md) for the status confirmed at this baseline.

Numbered image tags are used by deployment, but the workflow uses `github.run_number`, which is reused for a workflow re-run. Do not treat these tags as registry-enforced immutable references.
