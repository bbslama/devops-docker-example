---
name: github-aws-oidc
description: Safely plan or implement GitHub Actions federation to the training AWS account using repository- and environment-restricted OIDC instead of long-lived AWS keys.
---

# GitHub Actions and AWS OIDC

## Start and prerequisites

Inspect `AGENTS.md`, current state, security policy, workflow permissions, AWS readiness/OIDC approval, repository owner, target branch/environment, and requested milestone. Confirm account owner authorization and the exact trust subject intended without putting account IDs in Git.

## Procedure and expected output

Design GitHub OIDC trust for only `bbslama/devops-docker-example` and the intended branch/environment; define a least-privilege role for the exact deployment actions. Add `id-token: write` only to the job needing federation, keep other permissions minimal, and scope protected-environment approvals appropriately.

Document issuer/audience/subject constraints, role policy intent, workflow changes, audit evidence, troubleshooting steps, and rollback/disable procedure. AWS authentication should be temporary; do not store key pairs in GitHub secrets when OIDC is possible.

## Safety, validation, stop conditions

- Planning is read-only. Creating an OIDC provider, trust policy, IAM role, or workflow permission change is external/security-sensitive and requires explicit approval.
- Never print credentials, account IDs, JWT contents, tokens, or secret values. Do not broaden trust to all repositories, branches, or users.
- Validate exact claim matching and least privilege via review before creating trust. Test only in an approved environment; verify CloudTrail/role identity without disclosing sensitive identifiers.
- Stop if repository ownership, AWS account owner, branch/environment, audience, IAM scope, or approval boundary is unclear.
- Record only verified trust/deployment evidence and update current state after authorized work.

See [security and identities](../../../docs/security-and-identities.md), [roadmap](../../../docs/roadmap.md#milestone-11--github-actions-to-aws-planned), and [operations runbook](../../../docs/operations-runbook.md).

## Invocation example

Use the /github-aws-oidc skill to plan the GitHub-to-AWS trust relationship.
