---
name: milestone-planner
description: Turn exactly one roadmap milestone into a bounded implementation plan without implementing it.
---

# Milestone planner

## Start and prerequisites

Inspect `AGENTS.md`, `docs/current-state.md`, `docs/roadmap.md`, `docs/definition-of-done.md`, the selected milestone's dependencies, and relevant files. Confirm which single milestone the user requested; if unspecified, ask or recommend one after a state audit.

## Procedure and expected output

Produce a concise executable plan containing:

1. Milestone objective, current status, prerequisites, and evidence gaps.
2. In-scope changes and explicitly out-of-scope work.
3. Expected files/surfaces to inspect and likely files to change (not assumptions that they exist).
4. Ordered implementation steps, tests/commands, exact acceptance criteria, and objective evidence.
5. Risks, stop conditions, rollback, temporary-resource cleanup, identity/credential boundaries, and current-state update.

Check that the plan does not cross milestone dependencies or trigger external side effects. For AWS work, plan read-only readiness first unless the user has explicitly authorized a later action.

## Safety, validation, stop conditions

- Planning only: do not edit files, run mutating commands, deploy, access AWS, create secrets, or dispatch workflows.
- State assumptions and avoid fabricated resource names or credentials.
- Validate the plan against the milestone's definition of done and current repository state; clearly identify blockers.
- Stop if the request combines milestones, has unresolved account ownership/cost/authorization, or depends on unavailable evidence. Ask for scope/approval before implementation.
- Present the plan and wait for explicit implementation instruction.

See [roadmap](../../../docs/roadmap.md), [definition of done](../../../docs/definition-of-done.md), and [current state](../../../docs/current-state.md).

## Invocation example

Use the /milestone-planner skill to plan Milestone 8 without implementing it.
