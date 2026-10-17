---
name: milestone-validation
description: Validate one completed roadmap milestone against objective evidence without adding implementation changes.
---

# Milestone validation

## Start and prerequisites

Inspect `AGENTS.md`, current-state ledger, selected milestone and its dependencies in the roadmap, definition-of-done criteria, changed paths, and the user's requested validation scope. Confirm exactly one milestone.

## Procedure and expected output

Run only scoped, safe validation commands needed by that milestone. Capture actual exit status/output and resource/run identity. Separate:

- **PASS:** command or authoritative run/evidence succeeded.
- **FAIL:** a check ran and did not meet criteria.
- **BLOCKED:** cannot run due permissions, network, dependencies, or missing external setup.
- **SKIPPED:** intentionally not run; state why.

Report local checks separately from CI, registry, temporary deployment, and cloud validation. Confirm cleanup of named test resources. Update `docs/current-state.md` with dated changes, validation, remaining issues, and exactly one next step if the user authorized documentation updates.

## Safety, validation, stop conditions

- No new implementation during validation unless separately authorized; do not repair failures silently.
- Never fabricate results, infer CI from local checks, or claim registry/cloud state without evidence.
- No secrets in output. No destructive cleanup except explicitly named disposable resources and confirmed ownership.
- Stop if the requested check would trigger a main-only workflow, access unauthorized AWS, delete persistent data, or disclose credentials.
- Validate against the written milestone definition; a file existing is not completion. Preserve failure evidence and recommend a focused follow-up.

See [definition of done](../../../docs/definition-of-done.md), [current state](../../../docs/current-state.md), and [operations runbook](../../../docs/operations-runbook.md).

## Invocation example

Use the /milestone-validation skill to verify Milestone 5.
