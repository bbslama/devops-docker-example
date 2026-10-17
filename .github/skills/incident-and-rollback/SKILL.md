---
name: incident-and-rollback
description: Diagnose failed workflows or deployments, preserve redacted evidence, and guide exact-version rollback without broad destructive cleanup.
---

# Incident and rollback

## Start and prerequisites

Inspect `AGENTS.md`, current state, [operations runbook](../../../docs/operations-runbook.md), exact incident scope, current service status, and user authorization. Identify whether this is a local Compose test, GitHub workflow, registry, or AWS deployment. Start read-only.

## Procedure and expected output

1. Identify the first failing stage: tests, image build/scan/push, image pull, health check, smoke test, database, ECS, metrics, or logs.
2. Preserve timestamps, commit, exact version/digest, workflow URL or approved resource identifiers (redacted in docs), status, and relevant sanitized log excerpts.
3. Determine service impact and whether a previous numbered version/digest is known and compatible with the current DB schema.
4. When availability matters, propose a rollback to the last-known-good exact image and verify service health/smoke; do not use `latest` or rebuild on rollback.
5. Record root cause, cleanup status and follow-up milestone after incident response.

## Safety, validation, stop conditions

- Never print environment variables wholesale, credentials, token/JWT values, passwords, secret-bearing task definitions, or proxy URLs.
- Do not run global proxy changes, `docker system prune`, broad container/volume deletions, Terraform destroy, or AWS mutations during initial diagnosis.
- Rollback changes service state: require explicit authorization, confirm exact prior release and DB migration compatibility, and preserve database data.
- Stop and escalate if ownership, blast radius, rollback target, data loss, cost, or secret exposure is uncertain.
- Validate restoration using health, exact version/digest and smoke evidence; distinguish diagnosis from remediation.

See [current state](../../../docs/current-state.md), [architecture](../../../docs/architecture.md), and [security and identities](../../../docs/security-and-identities.md).

## Invocation example

Use the /incident-and-rollback skill to diagnose a failed release deployment.
