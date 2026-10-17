---
name: container-delivery
description: Use when explaining or changing the repository's Dockerfiles, Compose deployments, GitHub Actions delivery flow, or smoke acceptance.
---

# Container delivery

## Repository boundaries

- `compose.yaml` is the local build-and-run stack.
- `deploy/compose.yaml` is the pull-only release stack. Keep it free of `build:` directives.
- `.github/workflows/ci-cd.yml` is configured for pushes to `main` and manual dispatch. Feature-branch pushes alone do not match its push trigger.
- `scripts/smoke-test.sh` exercises frontend access, proxied backend health, and note create/read/delete.

## Delivery semantics

- Backend and frontend quality jobs gate the image build/scan/publish job; the temporary deployment consumes its version output.
- Image namespaces use the `DOCKERHUB_USERNAME` repository variable and `DOCKERHUB_TOKEN` secret.
- Deployment references the numbered tag, not `latest`, but tags derived from `github.run_number` are not guaranteed immutable because re-runs reuse the run number.
- The deploy job relies on anonymously pullable images unless pull authentication is deliberately added. Do not assume a local build or branch push proves publication or a remote deployment.
- Local validation can use temporary local-only overrides and credentials, but never commit those or disclose secrets.

## Safe verification

- Parse both Compose files with placeholder values; confirm the release config has images and no build directives.
- Use local quality checks and a temporary Compose project for acceptance where possible. Clean up only that test project and its disposable volume.
- Do not trigger the main-only delivery workflow, push, merge, create GitHub secrets, create Docker Hub repositories, or provision cloud resources unless the user explicitly asks.
- Record blocked checks with their evidence and environment constraints. Do not claim an external Actions run, published image, successful pull, deployment, or remote smoke test without the corresponding run or registry evidence.
