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
| Dockerfiles | COMPLETE (CI + local evidence) | Both committed Dockerfiles build from clean source on GitHub-hosted runners (run 39032952679). Backend runs as `10001:10001`, frontend as `101` (nginx-unprivileged); both expose 8080 and declare HEALTHCHECKs. Local builds on the personal machine are environment-blocked (see M2 log). |
| Local Compose | PARTIAL | `compose.yaml` config parses; its `build:` path is exercised indirectly by the same Dockerfiles. Local `up --build` is blocked on this machine by the corporate proxy. |
| Release Compose | COMPLETE (CI + local) | `deploy/compose.yaml` has no build directives. Pulled exact `bbslama/devops-example-*:1.0.2` on the runner (run 39035578572) and anonymously on the personal machine; all services healthy and smoke PASS in both. |
| Curl acceptance | COMPLETE (CI + local in-network) | `scripts/smoke-test.sh` now also asserts the Angular shell (`<app-root`). PASS on the runner and locally from a container on the Compose network. Host→container traffic (published port and container IP) times out on the personal machine. |
| CI workflow | COMPLETE (CI evidence) | `ci-cd.yml` on `main`: run 39034457876 (#1) showed parallel test jobs passing and a Trivy failure blocking publish with `deploy` skipped; run 39035578572 (#2) passed all four jobs; `backend-test-reports` artifact uploaded. actionlint 1.7.12 PASS. |
| Docker Hub | COMPLETE (registry evidence) | Variable `DOCKERHUB_USERNAME=bbslama` and secret `DOCKERHUB_TOKEN` configured 2026-10-17 (value never printed). Public repos `bbslama/devops-example-backend` and `-frontend` hold `1.0.2` (+ `latest` alias at the same digest); `1.0.1` was never published (404). |
| Trivy | COMPLETE (CI evidence) | Run #1 blocked on 3 fixable CRITICAL Tomcat 11.0.24 CVEs; fixed by `tomcat.version` 11.0.27 override; run #2 scan PASS for both `1.0.2` images. |
| DHI | BLOCKED (documented fallback) | `dhi.io` returns 401 for anonymous token/tag requests (2026-10-17); DHI pulls require an authenticated Docker account, which is not configured locally or in GitHub, and would also break the anonymous-pull release deploy. Maintained upstream fallbacks are used: `maven:3.9.16-eclipse-temurin-25`, `eclipse-temurin:25-jre`, `node:24.16.0-bookworm-slim`, `nginxinc/nginx-unprivileged:1.30.1-alpine`, `postgres:17.7-alpine` (tags verified on Docker Hub, amd64/arm64 available). |
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

## External state

Verified on 2026-10-17 (see milestone log): `ci-cd.yml` run 39035578572 on `main` passed tests, Trivy, publication of `1.0.2`, and temporary acceptance; Docker Hub `bbslama/devops-example-{backend,frontend}:1.0.2` digests were inspected and pulled anonymously. Still **not** verified or present: any persistent deployment, AWS access/OIDC/account permissions/region/budget, or tag immutability.

`ci-cd.yml` listens for pushes to `main` and `workflow_dispatch` (dispatch works only because the file is now on `main`); every push to `main`, including documentation-only changes, publishes a new `1.0.N`. `container-validation.yml` covers non-`main` branch pushes without publishing.

## Findings to carry forward

1. **Numbered tags are not guaranteed immutable.** The workflow derives `1.0.N` from `github.run_number`; rerunning that run reuses the number and can push over the same tag. `latest` is mutable too. Deployment selects the numbered tag, but tag immutability and digest pinning are not enforced. This is a future pipeline-hardening item; implementation was not changed here.
2. **Local image builds are environment-blocked.** Both Dockerfiles build on GitHub-hosted runners; local builds on the personal machine need an approved way to trust the corporate TLS-inspection CA.
3. **External validation obtained for 1.0.2.** CI, registry, and remote acceptance evidence is recorded in the milestone log; re-verify for each new release.
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

### 2026-10-17 — Milestone 2: Production-oriented containerization
- **Changes:** `frontend/Dockerfile` runtime moved to non-root `nginxinc/nginx-unprivileged:1.30.1-alpine` with `USER 101` and a HEALTHCHECK; **bug fix:** it previously copied `dist/notes-ui` (whose files live in `browser/`), so `/` served Nginx's default welcome page. `backend/Dockerfile` build stage bumped from stale `maven:3.9.11` (last updated 2025-11) to `maven:3.9.16-eclipse-temurin-25`. `scripts/smoke-test.sh` now asserts `<app-root`. New `.github/workflows/container-validation.yml` (non-`main` branch pushes touching app/compose/smoke paths, plus manual dispatch): builds both Dockerfiles, fails on root user or missing HEALTHCHECK, validates both Compose files (release has no `build:`), runs `deploy/compose.yaml` with the built images, smoke-tests, always tears down, and uploads the images as a 3-day artifact. Publishes nothing.
- **Local build:** BLOCKED — on this machine bridge containers have no DNS, egress requires the corporate proxy, and the proxy intercepts TLS with a corporate root CA not trusted inside images. TLS verification was not bypassed; per user decision, builds were validated on GitHub-hosted runners instead.
- **CI:** PASS — https://github.com/bbslama/devops-docker-example/actions/runs/39032952679 (commit `78d394d`): both images built; metadata check passed; database/backend/frontend Healthy; smoke `PASS: Angular frontend, proxied backend health, and note create/read/delete`; project `devops-example-build-39032952679` containers, network and volume removed. Previous run 39032711915 FAILED because `--pull never` also blocked `postgres:17.7-alpine`; fixed by pulling the database image first.
- **Local runtime with CI images:** PASS — artifact `app-images-78d394d…` loaded (backend `sha256:3486ba5e…`, user `10001:10001`; frontend `sha256:036d026f…`, user `101`). Project `devops-example-m2-local` started all three services healthy; smoke run from `curlimages/curl:8.17.0` on the Compose network PASSED. Host→container HTTP (published port and container IP) timed out — environmental, consistent with the earlier recorded limitation.
- **DHI:** BLOCKED — see DHI row; upstream fallbacks documented.
- **Cleanup:** PASS — both local Compose runs `down --volumes --remove-orphans` on project `devops-example-m2-local` only; downloaded archive deleted. Loaded `local/devops-example-*:ci-78d394d…` images retained for reference.
- **Remaining issues:** local container builds need an approved way to trust the corporate CA (or an unrestricted network); DHI requires authenticated Docker Hub access; GitHub Actions warns that `actions/checkout@v4`, `docker/*` v3/v6 target deprecated Node 20, and `ubuntu-latest` moves to Ubuntu 26 from 2026-10-19.
- **Next step:** Milestone 3 — continuous integration.

### 2026-10-17 — Milestone 3: Continuous integration (local validation scope)
- **Changes:** both workflows moved to Node 24 action majors (`checkout@v7`, `setup-java@v6`, `setup-node@v7`, `upload-artifact@v7`, `setup-buildx-action@v4`, `login-action@v4`, `build-push-action@v7`; release notes reviewed, no breaking inputs used). Added per-job `timeout-minutes`. `build-publish` now starts with a Docker Hub configuration check that fails with an explicit `BLOCKED` error/summary if `DOCKERHUB_USERNAME` or `DOCKERHUB_TOKEN` is absent (presence only, values never printed).
- **Structure review:** `backend-test` and `frontend-test` have no `needs` (run in parallel); `build-publish` needs both; `deploy` needs `build-publish`; workflow permissions `contents: read`; deploy teardown is `if: always()`; backend Surefire/Failsafe/JaCoCo reports uploaded `if: always()`.
- **Local:** PASS — actionlint 1.7.12 on all workflows; backend `clean verify` and frontend `npm run quality` PASS (see M0 entry, unchanged app code).
- **CI:** BLOCKED — `gh workflow run ci-cd.yml --ref devops-pipeline` returned `HTTP 404: workflow ci-cd.yml not found on the default branch`; `main` (`d80f0d3`) does not contain the workflow and was not modified. The changed Docker/artifact actions were exercised by `Container build validation` run https://github.com/bbslama/devops-docker-example/actions/runs/39033634100 (commit `7520759`): PASS, no Node 20 deprecation annotations.
- **Remaining issues:** a `ci-cd.yml` run needs the branch merged to `main` (user decision; push to `main` triggers the full pipeline); publication additionally needs `DOCKERHUB_USERNAME`/`DOCKERHUB_TOKEN` configured — otherwise the run will show test jobs passing and `build-publish` failing at the precheck with `deploy` skipped.
- **Next step:** user action — configure Docker Hub variable/secret, then merge `devops-pipeline` to `main` to obtain M3 CI evidence and M4/M5 publication/acceptance evidence.

### 2026-10-17 — Milestones 3–5: CI, image publication, and deployment acceptance (remote evidence)
- **Authorization/config:** user explicitly authorized setting `DOCKERHUB_USERNAME=bbslama` and the `DOCKERHUB_TOKEN` secret (set via stdin; value never printed or committed) and merging to `main`. The token was shared in a chat session; rotating it in Docker Hub is recommended.
- **Merges:** PR #1 (`devops-pipeline` → `main`, merge commit `59aab29`) and PR #6 (Tomcat fix). Merging also activated Dependabot on `main`; PRs #2–#5 were opened by Dependabot and left untouched.
- **Run #1 — FAIL (gate worked):** https://github.com/bbslama/devops-docker-example/actions/runs/39034457876 — backend and frontend test jobs passed in parallel; Docker Hub precheck and login passed; Trivy found 3 fixable CRITICAL CVEs in `tomcat-embed-core` 11.0.24 (CVE-2026-65182, CVE-2026-65905, CVE-2026-68525; fixed in 11.0.25) in the backend image, so nothing was pushed and `deploy` was skipped. Docker Hub confirms no `1.0.1` tags (HTTP 404).
- **Fix:** `backend/pom.xml` overrides `tomcat.version` to 11.0.27 (latest 11.0.x; Spring Boot 4.1.1 is the newest 4.1 release and still manages 11.0.24). Local `clean verify` PASS (4 + 1 tests, 0 Checkstyle violations; jar contains `tomcat-embed-*-11.0.27`). Host Maven needed a temporary proxy-only `settings.xml` under `/tmp`, deleted after use. Branch validation run 39035365877 PASS.
- **Run #2 — PASS:** https://github.com/bbslama/devops-docker-example/actions/runs/39035578572 (push to `main`, version `1.0.2`): backend tests 58s and frontend 16s in parallel; Trivy PASS for both images; published:
  - `bbslama/devops-example-backend:1.0.2` → `sha256:5092984aab80e3bc1e0c7787c92ffd7139630dd7a69445311297953fbd6e63a8`
  - `bbslama/devops-example-frontend:1.0.2` → `sha256:5dbf3905899d4cb594b8c975e06dd971161dfb9016623246fece4441b815506e`
  - `latest` aliases point to the same digests (Docker Hub API).
  - Acceptance project `devops-example-acceptance-39035578572`: pulled exact `1.0.2` images (no build), database/backend/frontend Healthy, smoke `PASS: Angular frontend, proxied backend health, and note create/read/delete`, containers/network/volume removed by the `always()` teardown.
- **Local registry check:** PASS — with an empty temporary `DOCKER_CONFIG` (anonymous), `docker compose -f deploy/compose.yaml pull` fetched `1.0.2` with RepoDigests matching the digests above; project `devops-example-m5-local` started healthy; in-network smoke PASS; `down --volumes --remove-orphans` removed only that project.
- **Remaining issues:** numbered tags remain mutable on re-run and `latest` moves (M6); deploy job relies on public repositories; `ubuntu-latest` migrates to Ubuntu 26 from 2026-10-19; the Tomcat override must be removed once Spring Boot manages ≥ 11.0.25; Dependabot PRs #2–#5 need review (e.g. Checkstyle 10 → 14 and TypeScript 6 → 7 are major bumps).
- **Next step:** Milestone 6 — pipeline hardening and promotion.

## Milestone update template

Append a dated entry only after executing the milestone checks:

```markdown
### YYYY-MM-DD — Milestone N: short title
- **Changes:** paths and behavior changed, or “documentation only”.
- **Validation:** commands/evidence and PASS/FAIL/BLOCKED/SKIPPED results.
- **Remaining issues:** evidence-backed gaps.
- **Next step:** one recommended milestone.
```
