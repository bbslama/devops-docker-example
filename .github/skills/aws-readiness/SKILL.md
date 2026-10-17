---
name: aws-readiness
description: Assess training-account ownership, permitted region, IAM, budgets, quotas, OIDC and teardown requirements without provisioning AWS resources.
---

# AWS readiness

## Start and prerequisites

Inspect current state, `AGENTS.md`, roadmap M7, and security/identity policy. Confirm user specifically requests a readiness assessment and that the training-center account is theirs/authorized. No account ID or credentials should be written to repository files.

## Procedure and expected output

Use only user-approved read-only checks and report findings without sensitive identifiers: authentication method/role status, permitted region, IAM limitations, quotas, budget/cost ceiling, naming/tagging policy, OIDC feasibility, Terraform backend/state strategy, and deletion/retention rules. Produce an explicit readiness checklist, blockers, cost risks, and an infrastructure teardown plan before any provisioning milestone.

Prefer AWS SSO or approved temporary credentials. Plan OIDC trust for the intended repository and branch/environment; avoid long-lived access-key pairs. Do not call write APIs.

## Safety, validation, stop conditions

- Never print credentials, caller account IDs, secret values, or private organizational data. Do not inspect credential file contents.
- Do not create/update/delete resources, IAM roles, OIDC providers, budgets, state buckets, or secrets. Do not run `apply` or `destroy`.
- Stop if account ownership, authorization, region, permissions, budget, or safe teardown is unclear.
- Validate readiness findings against authoritative account-owner guidance and safe read-only tool outputs. Label unavailable checks BLOCKED rather than assumed ready.
- Report no resources created and recommend only one next milestone.

See [security and identities](../../../docs/security-and-identities.md) and [Milestone 7](../../../docs/roadmap.md#milestone-7--aws-account-readiness-planned).

## Invocation example

Use the /aws-readiness skill to assess the training-center account without creating resources.
