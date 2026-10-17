# Future Copilot session starter

Use this prompt at the start of a new repository session:

> Read `AGENTS.md`, `docs/current-state.md`, and `docs/roadmap.md`. Use `/project-state-audit` to inspect the repository, branch, toolchain, identity boundaries, and evidence without changing files. Recommend exactly one next milestone and explain its prerequisites and status. Use `/milestone-planner` to prepare a bounded plan with files, validation, risks, cleanup, and definition-of-done evidence. Present the plan and wait for my explicit instruction before implementing. If I authorize implementation, change only that milestone, use its specialist skill, preserve existing behavior, and do not touch later milestones or external resources without explicit approval. Then use `/milestone-validation`, report passed/failed/blocked/skipped separately, update `docs/current-state.md` with evidence, and recommend one next milestone.

At session start, skills may need reloading:

```text
/skills reload
/skills list
/skills info project-state-audit
```

Copilot CLI and Copilot agent mode may expose skills differently by client/version. Confirm availability in the current session; do not pretend a skill ran if it was not loaded.

## Example future prompts

- `Use /project-state-audit and recommend the next milestone. Do not change files.`
- `Use /milestone-planner to plan Milestone 7. Do not access AWS.`
- `Implement Milestone 8 using /terraform-aws-foundation, stopping after a reviewed Terraform plan. Do not apply.`
- `Validate Milestone 10 using /milestone-validation.`
- `Use /incident-and-rollback to diagnose the failing deployment without modifying infrastructure initially.`
