# Current state and evidence ledger

**Inspected:** 2026-10-17. **Repository:** `bbslama/devops-docker-example`. **Branch:** `devops-pipeline`. **HEAD:** `79dbd2ceb1644fd9f5007c26c0af70bf94a7f4b9` (`add skills`), fetched and equal to `origin/devops-pipeline`. It descends from implementation commit `308088a40a1f679d6d059a3b7cf5af8c0bc1533f`; `main`/`origin/main` was `d80f0d3` (`initial app setup`) at inspection. Worktree was clean before the present documentation changes. No repository-local Git author name/email was configured.

This ledger deliberately distinguishes source/configuration from verified behavior. A file or workflow existing does not prove it ran, artifacts exist, or an environment is deployed. See [roadmap](roadmap.md) for milestone classifications and [definition of done](definition-of-done.md) for evidence needed to advance statuses.

## Repository contents and classifications

| Area | Status | Evidence in repository / validation |
| --- | --- | --- |
| Notes API | COMPLETE | Spring Boot 4.1.1, Java 25, JPA, validation, Actuator, Flyway; CRUD endpoints and exception handling under `backend/src/main/java/com/example/notes/`. |
| Database schema | COMPLETE | PostgreSQL 17.7; `backend/src/main/resources/db/migration/V1__create_notes.sql`; Hibernate schema mode is validate. |
| Backend tests | COMPLETE locally | Service/controller tests plus PostgreSQL Testcontainers integration test. Recorded `./mvnw clean verify`: 5 total tests passed, Checkstyle 0 violations, JaCoCo report generated. |
| Frontend | COMPLETE locally | Angular 22.2.3 with reactive form and notes service. Recorded `npm run quality`: ESLint passed, 2 Vitest tests passed, production build passed. |
| Dockerfiles | PARTIAL | Multi-stage backend/frontend Dockerfiles and ignore files exist. Frontend Dockerfile built locally; backend Dockerfile build was blocked resolving Maven Central from the container build environment. |
| Local Compose | PARTIAL | `compose.yaml` builds backend/frontend and runs PostgreSQL. Config parsed. A local Compose-network smoke test passed using a temporary runtime-only backend image, not the committed backend Dockerfile. |
| Release Compose | PARTIAL | `deploy/compose.yaml` uses exact versioned image references and has no build directives; config parsed. External images/pull deployment are not verified. |
| Curl acceptance | PARTIAL | `scripts/smoke-test.sh` checks frontend, proxied health, and create/list/delete. Passed from the temporary Compose network. Host-published loopback requests timed out in the validating environment's proxy/network setup. |
| CI workflow | PARTIAL | `.github/workflows/ci-cd.yml` defines parallel test jobs, build/scan/publish, temporary release Compose deployment, smoke test and cleanup. No Actions execution evidence was inspected or asserted. |
| Docker Hub | BLOCKED / unverified | Workflow expects repository variable `DOCKERHUB_USERNAME` and secret `DOCKERHUB_TOKEN`; configuration, login, repositories, image tags, and anonymous pulls are not confirmed. |
| Trivy | PARTIAL | Workflow is configured to scan both built application images for fixable critical findings. Remote scan result and registry publication are unverified. |
| DHI | BLOCKED / unverified | Current files use explicit upstream Maven/Temurin, Node, Nginx, and PostgreSQL images. No compatible accessible DHI tag was verified. |
| AWS/Terraform/ECS | PLANNED | No Terraform, AWS deployment, or cloud resources are present. ECS Fargate, not EKS, is the target. |
| Observability and centralized logging | PLANNED | No Prometheus/Grafana dashboards, alerting, or centralized logging system is present. Actuator health/info alone is not full observability. |
| Local Kubernetes | OPTIONAL | Not present and not a prerequisite for ECS. |

## Validation record

These local results were recorded during implementation work on the pre-documentation state. They are not GitHub-hosted CI, Docker Hub, or cloud evidence:

- Backend `clean verify`: 4 unit/controller tests and 1 PostgreSQL Testcontainers test passed; Checkstyle reported no violations; JaCoCo report generated.
- Frontend `npm ci` and `npm run quality`: lint passed, 2 tests passed, production build passed.
- Frontend Dockerfile build passed. Backend Dockerfile build could not resolve Maven Central from its build container; TLS verification was not bypassed.
- Local and release Compose configurations parsed; release Compose was confirmed to contain no `build` directives.
- Temporary Compose health checks and curl CRUD smoke test passed inside the Compose network using a temporary runtime-only backend image.
- Host access to published loopback port timed out under the environment's proxy/network settings. This does not establish that a GitHub-hosted deployment fails.
- A dedicated Actions YAML linter was unavailable during that recorded validation.

## External state: not asserted

No current Actions run, run URL, Docker Hub image digest/tag, or AWS environment has been independently verified here. In particular, do not infer that:

- a main-branch or manually dispatched Actions workflow has completed;
- the Docker Hub variable/token are configured or valid;
- application images have been published and are pullable;
- the pull-only deployment succeeded on GitHub Actions;
- the smoke test ran remotely or passed;
- AWS access, OIDC, account permissions, region, or budget are ready.

The workflow listens for pushes to `main` and `workflow_dispatch`; `devops-pipeline` pushes alone do not match the push trigger. Do not dispatch it during planning.

## Findings to carry forward

1. **Numbered tags are not guaranteed immutable.** The workflow derives `1.0.N` from `github.run_number`; rerunning that run reuses the number and can push over the same tag. `latest` is mutable too. Deployment selects the numbered tag, but tag immutability and digest pinning are not enforced. This is a future pipeline-hardening item; implementation was not changed here.
2. **Backend image validation gap.** The committed Dockerfile build was not validated in the prior restricted build-network environment. A temporary runtime-only image demonstrated the JAR/Compose behavior but does not substitute for a build of `backend/Dockerfile`.
3. **External validation absent.** CI, registry, and remote acceptance state require evidence from GitHub Actions and Docker Hub.
4. **DHI fallback remains.** Catalog existence is not evidence of compatible tags, access, architecture, or runtime compatibility.
5. **Host-port access was environment-limited.** Compose-network traffic passed; host loopback requests timed out due the local proxy/network context. Recheck safely on the unrestricted personal machine.
6. **Personal-machine readiness is not established.** Inspect relevant toolchain, identity, and proxy configuration there without disclosing values or changing settings absent explicit approval.

## Recommended next milestone

See the latest entry in the milestone log below. (Milestone 0 was completed on the personal Ubuntu machine on 2026-10-17.)

<!-- Historical recommendation retained for context: -->
**Earlier recommendation — Milestone 0 — Baseline and repository audit:** on the personal Ubuntu computer, verify repository ownership, local branch/identity and remote state, inspect toolchains/credentials safely, check whether proxy configuration exists without printing credentials, and run the local test suite. Do not make implementation changes during the audit. Record only actual command evidence. Then plan one next milestone; the roadmap's likely next implementation gap is completing a reproducible build of the committed backend Dockerfile and validating the existing pipeline externally only after its credentials and trigger are explicitly confirmed.

## Milestone log

### 2026-10-17 — Milestone 0: Baseline and repository audit (personal Ubuntu machine)
- **Changes:** documentation only.
- **Repository:** remote `https://github.com/bbslama/devops-docker-example.git`; branch `devops-pipeline` tracking `origin/devops-pipeline` at `05ef1c4`, clean worktree; `main` at `d80f0d3`. Personal `github.com` account `bbslama` has admin permission (`gh api repos/...`). Repository-local Git author is configured.
- **Toolchain:** PASS — OpenJDK 25.0.4.1, Node v24.16.0, npm 11.17.0, Docker Engine 29.9.1 (usable without sudo), Docker Compose v5.6.0, GitHub CLI authenticated (tokens not displayed), Copilot CLI present. Terraform not installed (not needed before M8).
- **Proxy presence (values not printed):** shell proxy variables (`HTTP(S)_PROXY`, `NO_PROXY`, `ALL_PROXY`, lowercase variants) and npm `proxy`/`https-proxy` are set; no Git proxy keys; no Maven `settings.xml`. Nothing was changed. npm also warns about an unknown user-level `tokenHelper` key from a work registry config; left untouched.
- **Backend:** PASS — `./mvnw --batch-mode --no-transfer-progress clean verify`: 4 unit/controller tests + 1 PostgreSQL Testcontainers IT passed, 0 Checkstyle violations, BUILD SUCCESS.
- **Frontend:** PASS — `npm run quality`: ESLint passed, 2 Vitest tests passed, production build succeeded.
- **External state:** no Actions runs exist for the repository; no repository variables or secrets are configured (`gh variable list`/`gh secret list` empty), so Docker Hub publication (M4) is BLOCKED until the user configures `DOCKERHUB_USERNAME`/`DOCKERHUB_TOKEN`.
- **Next step:** Milestone 2 — production-oriented containerization.

## Milestone update template

Append a dated entry only after executing the milestone checks:

```markdown
### YYYY-MM-DD — Milestone N: short title
- **Changes:** paths and behavior changed, or “documentation only”.
- **Validation:** commands/evidence and PASS/FAIL/BLOCKED/SKIPPED results.
- **Remaining issues:** evidence-backed gaps.
- **Next step:** one recommended milestone.
```
