---
name: terraform-aws-foundation
description: Plan or implement one authorized Terraform milestone for the training AWS foundation with reviewed state, cost, security and teardown controls.
---

# Terraform AWS foundation

## Start and prerequisites

Inspect repository status, `AGENTS.md`, current state, roadmap/definition of done, Terraform files (if any), AWS readiness record, and the specifically authorized milestone. Confirm the approved account/region and state backend without printing IDs or credentials. If M7 is not complete, plan M7 instead.

## Procedure and expected output

Progress in order: provider/version constraints and protected state strategy; environment structure, names/tags; network design (VPC, public/private subnets, routes, IGW, cost-aware NAT decision, security groups); then approved ECS/ALB/ECR foundation. Prefer simple reusable structure, not excessive modules. Target ECS Fargate, not EKS.

For implementation, report files, resources, cost/network assumptions, state handling, plans, outputs, and teardown sequence. Require `terraform fmt -check`, `init`, `validate`, and a saved/reviewed plan before asking whether to apply.

## Safety, validation, stop conditions

- No apply, destroy, import, or external changes without explicit scoped authorization after plan review. Do not create AWS resources during readiness or planning.
- No secrets in source, committed tfvars, outputs, logs, or committed state/plans. State may contain sensitive data; use approved encryption, locking, access control, and retention.
- Enforce least privilege, private data paths, cost limits, and deletion review. EKS is out of scope.
- Validate syntax and plan output; explain replacements, public ingress, NAT/ALB cost, and destructive effects. Stop on unclear ownership, backend, region, costs, authorization, or unexpected plan.
- Preserve current state and write only the authorized milestone; record evidence/current state after approval and validation.

See [security and identities](../../../docs/security-and-identities.md), [operations runbook](../../../docs/operations-runbook.md), and [Milestone 8](../../../docs/roadmap.md#milestone-8--terraform-foundation-planned).

## Invocation example

Use the /terraform-aws-foundation skill to plan and implement the next Terraform milestone only.
