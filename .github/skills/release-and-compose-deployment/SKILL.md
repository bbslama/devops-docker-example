---
name: release-and-compose-deployment
description: Pull and validate an exact previously published application version with the repository's pull-only Compose deployment, smoke test, cleanup, or rollback.
---

# Release and Compose deployment

## Start and prerequisites

Inspect `AGENTS.md`, current state, `deploy/compose.yaml`, `.env.example`, smoke script, and the requested release's registry evidence. Confirm the target is a disposable local acceptance environment or a user-authorized deployment.

## Procedure and output

- Require exact `DOCKERHUB_USERNAME`, `APP_VERSION`, DB name/user/password presence; do not print secret values. Verify registry tag exists before pull.
- Resolve Compose configuration and confirm every application service uses an exact versioned `image:` and there is no `build:` key. Do not substitute `latest`.
- Pull, start, wait for DB/backend/frontend health, run `scripts/smoke-test.sh`, capture version/digests/status and report PASS/FAIL/BLOCKED.
- For a temporary test, use a unique project name and an unconditional cleanup trap. Confirm project ownership and database data disposability before `down --volumes`.
- For rollback, select only an evidence-backed previous numbered tag/digest, preserve the DB, verify health/smoke, and stop if migration compatibility is unknown.

## Safety, validation, stop conditions

- Do not create registry repositories, login credentials, external resources, or permanent hosting as part of a local acceptance request.
- The current GitHub deploy job expects anonymously pullable images. Stop if private-image auth is needed but not configured.
- Do not overwrite/delete releases, modify release Compose unexpectedly, prune Docker resources, or claim remote deployment from local tests.
- Validate exact pulled versions, health and CRUD smoke; record cleanup status. Ask before destructive DB volume removal or rollback affecting users.
- Stop on unknown image provenance/version, ambiguous environment/project, non-disposable data, or an unverified previous release.

See [operations runbook](../../../docs/operations-runbook.md), [architecture](../../../docs/architecture.md), and [Milestone 5](../../../docs/roadmap.md#milestone-5--deployment-acceptance-partial).

## Invocation example

Use the /release-and-compose-deployment skill to deploy and validate version 1.0.14.
