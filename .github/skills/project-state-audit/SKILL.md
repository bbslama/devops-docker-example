---
name: project-state-audit
description: Inspect repository, branch, implementation, validation evidence, and blockers without changing files; recommend exactly one next roadmap milestone.
---

# Project state audit

## Start and prerequisites

Read `AGENTS.md`, `docs/current-state.md`, `docs/roadmap.md`, and the relevant definition-of-done section. Confirm the repository root and user-requested scope. This skill is read-only.

## Procedure

1. Inspect `git status --short`, current branch, remotes (avoid credential-bearing URLs), recent commits, and branch ancestry where a baseline is specified.
2. Inspect tracked repository structure, `AGENTS.md`/Copilot guidance, application, tests, Dockerfiles, Compose, workflows, scripts, and docs relevant to the project.
3. Inspect tool and version availability only as relevant. Do not run builds, deployments, or cloud commands unless separately requested.
4. Classify each roadmap item COMPLETE, PARTIAL, PLANNED, OPTIONAL, BLOCKED, or SUPERSEDED with evidence. Distinguish implemented, locally validated, CI validated, committed, pushed, published, temporary deploy, and persistent deploy.
5. Identify drift and blockers without repairing them. Recommend exactly one next milestone with dependency and rationale.

## Safety, output, validation, stop conditions

- Do not modify files, authenticate, print credentials, inspect token contents, alter proxy settings, dispatch workflows, or create external resources.
- Do not infer success from a file's existence. Cite paths, command output already available, commit/run evidence, and explicitly state unknowns.
- Return branch/HEAD/dirty state, status matrix, evidence and gaps, one next milestone, and any manual verification needed. Update `docs/current-state.md` only when the user explicitly asks.
- Stop if repository ownership/branch is ambiguous, evidence would require secret disclosure, or a read-only boundary cannot be maintained; ask before proceeding.
- Validate the report against the actual tree and the roadmap. No code/test command is required for an audit.

See [current state](../../../docs/current-state.md), [roadmap](../../../docs/roadmap.md), and [security and identities](../../../docs/security-and-identities.md).

## Invocation example

Use the /project-state-audit skill to determine the next milestone without changing files.
