# Current state at the pushed baseline

**Baseline:** `bbslama/devops-docker-example`, branch `devops-pipeline`, commit `308088a40a1f679d6d059a3b7cf5af8c0bc1533f`.

The branch was fetched and verified at this baseline before documentation work. This file records the distinction between repository configuration, local validation evidence, and external delivery evidence. A configured workflow is not evidence that it has run successfully.

## Repository implementation

The baseline contains:

- A Spring Boot Notes API, PostgreSQL persistence, Flyway schema migration, health/info endpoints, and backend tests.
- An Angular Notes UI and Nginx reverse proxy.
- A local build-and-run Compose file and a separate pull-only `deploy/compose.yaml`.
- A GitHub Actions workflow configured for pushes to `main` and manual dispatch. It tests both apps, builds and scans images, pushes Docker Hub tags, then pulls a versioned release Compose stack for temporary acceptance.
- A curl smoke test that checks frontend availability and backend health, then creates, reads, and deletes a note.

## Validation evidence

| Area | Evidence/status |
| --- | --- |
| Backend quality | Local `clean verify` completed successfully: 4 unit/controller tests and 1 PostgreSQL Testcontainers integration test passed; Checkstyle reported 0 violations and JaCoCo generated a report. |
| Frontend quality | Local `npm run quality` completed: ESLint passed, 2 Vitest tests passed, and the production build completed. |
| Frontend image | The frontend Dockerfile built locally. |
| Compose definitions | Both Compose configurations parsed; the release configuration contains no `build:` directives. |
| Temporary Compose acceptance | Health checks and the curl CRUD smoke test passed on the Compose network using the verified backend JAR in a temporary runtime-only image. This did **not** validate the production backend Dockerfile build. |
| Backend Dockerfile | A local Dockerfile build could not resolve Maven Central from the build container in the environment used for validation. No TLS bypass was used. |
| Host-published frontend port | Host curl requests timed out in the local proxy/network setup. The smoke test passed from the Compose network; host-port reachability in that environment was not established. |
| Workflow lint | No dedicated Actions workflow linter was available during the recorded local checks. |

These are local validation results only. They are not GitHub-hosted Actions results.

## External delivery not established

No GitHub Actions run or run log is asserted by this document. The following remain **unverified** unless separately confirmed in the relevant external systems:

- Whether the `main`-branch delivery workflow has run, or any manual run completed.
- Whether repository variable `DOCKERHUB_USERNAME` and secret `DOCKERHUB_TOKEN` are configured and valid.
- Whether either image was published to Docker Hub, and whether the deployment runner can pull it.
- Whether the pull-only deployment succeeded on GitHub Actions.
- Whether the smoke test ran and passed in GitHub Actions.
- Whether the Docker Hardened Images alternatives have compatible verified tags and pull access. The repository currently uses explicit upstream image tags as fallbacks.

Do not create credentials, Docker Hub repositories, or other external resources as part of documenting this status.

## Discovered issue and limitation

The README had described numbered image tags as immutable. That is stronger than the implementation guarantees: the image tag is derived from `github.run_number`, and rerunning a workflow run reuses that number and can publish over the same tag. `latest` is also intentionally mutable. Deployment does pin to the numbered tag rather than `latest`, but neither tag immutability nor digest pinning is enforced. This discrepancy is documented here rather than changing the delivery implementation.

The local backend Dockerfile build and host-published frontend port were blocked by environment-specific networking, while a Compose-network acceptance test passed using a temporary runtime-only backend image. Do not treat either local limitation as evidence of a GitHub Actions outcome.
