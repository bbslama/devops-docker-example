---
name: ecs-deployment
description: Plan or perform an explicitly authorized deployment of an existing exact application release to ECS Fargate, with health, smoke, rollback and cost checks.
---

# ECS Fargate deployment

## Start and prerequisites

Inspect `AGENTS.md`, current state, architecture, roadmap, Terraform outputs/configuration, release image evidence/digests, DB/secrets design, and authorized target environment. Confirm M7–M9 prerequisites, AWS ownership/region, budget, and that deployment is explicitly requested. No EKS.

## Procedure and expected output

Use exact already-built frontend/backend image digests or verified immutable release identities; do not rebuild during deployment. Review task definitions, ECS services, ALB/target groups, health checks, execution/task IAM roles, Secrets Manager references, private RDS connectivity, CloudWatch log groups and network boundaries.

For an authorized deployment, apply only the approved plan/process, wait for ECS service stability, verify target health and app health, run cloud curl CRUD smoke, record deployed version/digests and logs, and state rollback target. Never invent resource names; get them from approved outputs.

## Safety, validation, stop conditions

- Preserve database and existing service state; do not destroy or replace resources without explicit approval.
- Do not put secrets in task definitions as literals, command logs, or documentation. Prefer secret references.
- Stop on failed health, unknown version, unapproved cost, public DB ingress, missing secret/network access, or migration incompatibility. Roll back only to a confirmed prior exact version when authorized and service availability matters.
- Validate stability, target health, exact task image identity, smoke and log access. Clean only named temporary resources; persistent ECS is not temporary Compose.
- Update current state with cloud evidence only after it exists; never infer deployment from Terraform files.

See [architecture](../../../docs/architecture.md), [operations runbook](../../../docs/operations-runbook.md), and [Milestone 10](../../../docs/roadmap.md#milestone-10--ecs-fargate-deployment-planned).

## Invocation example

Use the /ecs-deployment skill to deploy release 1.0.14 to the development ECS environment.
