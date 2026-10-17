---
name: github-actions-cicd
description: Build, explain, or debug this repository's main-branch container CI/CD workflow while preserving test gates, release identity, and safe credential handling.
---

# GitHub Actions CI/CD

## Start and prerequisites

Inspect current branch/status, `AGENTS.md`, current-state evidence, workflow, both app test commands, local and release Compose files, smoke script, and selected milestone's definition of done. Do not assume a workflow run occurred.

## Required pipeline intent

- Automatic trigger on `main` and manual `workflow_dispatch`; do not dispatch without explicit approval.
- Backend Maven verification and frontend ESLint/Vitest/build run in parallel and gate image publication.
- Build both app images once with the same initial version `1.0.${{ github.run_number }}`; publish numbered tags and `latest` convenience aliases. Never deploy `latest`.
- Docker Hub uses repository variable `DOCKERHUB_USERNAME` and secret `DOCKERHUB_TOKEN`. No credentials in source/output; do not create or inspect secret values.
- Keep Trivy lightweight; no Hadolint requirement and no Playwright/Cypress/Selenium browser E2E.
- Deployment acceptance pulls exact numbered images through release Compose, waits for health, runs bounded curl smoke, and cleans the temporary project even on failure.
- Keep permissions least-privilege. Image tags derived from run number are not immutable across reruns; do not claim otherwise. Plan digest/unique-release enforcement in M6.

## Safety, validation, stop conditions

- Preserve unrelated jobs/workflow behavior; do not build/publish before required checks.
- Validate YAML with an Actions-aware linter when available; inspect triggers, dependencies, permissions, expressions, shell failure handling, artifacts, and `always()` cleanup.
- For remote validation, require an authorized run. Record URL, event, commit, version, job outcomes, published digests, deployment health and smoke; no success without logs.
- Never push, merge, dispatch, create credentials, Docker Hub repositories, or AWS resources unless explicitly requested. Stop if variable/secret availability, image visibility, permissions, or requested trigger is ambiguous.
- Report PASS/FAIL/BLOCKED/SKIPPED and update current state only after evidence is available.

See [architecture](../../../docs/architecture.md), [security and identities](../../../docs/security-and-identities.md), and [Milestones 3–6](../../../docs/roadmap.md#milestone-3--continuous-integration-partial).

## Invocation example

Use the /github-actions-cicd skill to implement or debug the container delivery workflow.
