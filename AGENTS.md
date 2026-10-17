# Repository guidance

This is a DevOps training project. The Notes app is a small workload for learning tested container delivery, then AWS operations and observability; keep application scope modest.

**Current stack:** Java 25, Spring Boot 4.1.1, Maven Wrapper, Angular 22.2.3, Node 24, PostgreSQL 17.7, Nginx 1.30.1, Docker Compose, GitHub Actions, Docker Hub, and Trivy. Versions and evidence are recorded in [current state](docs/current-state.md).

## Before changing anything

- Inspect `git status`, current branch, recent commits, repository tree, and the exact files in scope. Check `AGENTS.md`, `docs/current-state.md`, the [roadmap](docs/roadmap.md), and the relevant skill.
- Choose and implement **one roadmap milestone at a time**. Review its dependencies and definition of done before editing. Do not expand into later milestones.
- After an implemented milestone, validate its [definition of done](docs/definition-of-done.md) and update `docs/current-state.md` with evidence, blockers, and the next step.
- Preserve working behavior. Distinguish implemented, locally validated, committed, pushed, CI-validated, published, and deployed states. Never report success without command output or authoritative external evidence.

## Repository map

- `backend/`: Spring Boot API, Flyway migration, Maven Wrapper, tests, Dockerfile.
- `frontend/`: Angular UI, tests, npm scripts, Dockerfile, Nginx configuration.
- `compose.yaml`: local build-and-run stack.
- `deploy/compose.yaml`: pull-only release stack.
- `scripts/smoke-test.sh`: HTTP health and note CRUD acceptance check.
- `.github/workflows/`: Actions delivery workflow.
- `.github/skills/`: reusable repository skills.
- `docs/`: charter, architecture, current state, roadmap, operations, security, decisions, and handoff.

## Safe commands and boundaries

Safe local checks (inspect Docker/network prerequisites first):

```sh
cd backend && ./mvnw --batch-mode --no-transfer-progress clean verify
cd frontend && npm ci && npm run quality
docker compose --env-file deploy/.env -f compose.yaml config --quiet
git diff --check
```

- Never expose or commit credentials. GitHub personal account, work-managed GHE Copilot entitlement, personal Docker Hub, and training-center AWS identities are separate; see [security and identities](docs/security-and-identities.md).
- Prefer compatible, accessible, practical Docker Hardened Images (DHI); inspect the catalog first and document maintained upstream fallbacks. Never guess image names.
- No Playwright, Cypress, Selenium, or browser E2E. Use the existing unit/service tests and curl smoke acceptance. Hadolint is not required.
- AWS authentication should use approved temporary auth and GitHub OIDC; do not use long-lived AWS access-key pairs where OIDC is possible.
- The main CI/CD workflow runs on `main` pushes and manual dispatch, not feature-branch pushes. Do not manually dispatch it unless requested. Configure Docker Hub variable/secret only by explicit user action.
- Both app images share `1.0.${{ github.run_number }}`; deploy the exact numbered tag, never `latest`. Re-runs reuse the run number, so the implementation does **not** guarantee tag immutability.
- Ask before deleting project data or resources. Do not run `git reset --hard`, `git clean -fd`, `docker system prune`, broad container/volume deletion, or cloud destroy commands. Never remove global proxy settings blindly.
- Do not push, merge, modify `main`, create external resources, or provision cloud infrastructure without explicit authorization.

## Knowledge and skills

Read [project charter](docs/project-charter.md), [architecture](docs/architecture.md), [roadmap](docs/roadmap.md), [definition of done](docs/definition-of-done.md), [operations runbook](docs/operations-runbook.md), and [security and identities](docs/security-and-identities.md). Reload/list skills in Copilot CLI with `/skills reload` and `/skills list`; select the focused skill for the task. Start by using `/project-state-audit`; plan before implementation, then validate and update current state.
