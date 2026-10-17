---
name: local-environment-readiness
description: Safely audit an unrestricted personal Ubuntu machine's toolchains, GitHub identities, Docker access, registry/DHI access, and proxy configuration before implementation.
---

# Local environment readiness

## Start and prerequisites

Inspect `AGENTS.md`, `docs/security-and-identities.md`, and `docs/current-state.md`. Confirm this is the personal computer and the requested audit scope. Prefer read-only commands and inspect one category at a time.

## Procedure and output

Check, as applicable: repository URL/branch/Git identity; Java 25; Node 24/npm; Docker Engine and Compose v2; Docker usability without sudo; GitHub CLI personal auth status; Copilot CLI work entitlement availability; personal Docker Hub access; public GitHub/Docker Hub/DHI catalog connectivity; future AWS CLI presence only if requested. Report command/version, PASS/FAIL/BLOCKED, and follow-up.

Inspect proxy configuration presence without printing values: shell variable names only; Git proxy key presence; npm proxy setting presence; Maven settings files; Docker daemon/systemd proxy configuration; shell startup file references. Never print a proxy URL that may embed a credential.

## Safety, validation, stop conditions

- Do not authenticate, print tokens, change Git identity, add Docker group membership, install software, modify shell/global config, remove proxies, or change credentials.
- Keep personal GitHub, work-managed GHE Copilot, Docker Hub, and training AWS identities separate; do not copy credentials.
- If an obsolete setting appears likely, record only its source/key and ask before removing that exact setting. Never blindly remove global proxies.
- Do not inspect credential file contents. Stop if ownership or identity is unclear or the requested check would reveal a secret.
- Validate report completeness against the checklist in [security and identities](../../../docs/security-and-identities.md). Do not claim access from a version check alone.

See [operations runbook](../../../docs/operations-runbook.md) for safe local checks.

## Invocation example

Use the /local-environment-readiness skill to audit this personal Ubuntu machine before implementation.
