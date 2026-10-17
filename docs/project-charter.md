# Project charter

## Purpose

Build a small, understandable DevOps training project that demonstrates a change moving from source control through automated checks, container publication, deployment validation, and eventually cloud operations. The value is in the delivery lifecycle, not in application feature breadth.

## Learning objectives

Demonstrate:

- source control and a safe GitHub branch workflow;
- minimal backend/frontend automated tests and quality checks;
- reproducible Docker image builds;
- versioned artifact publication and promotion;
- deployment and bounded curl acceptance;
- infrastructure as code and a persistent AWS container runtime;
- practical metrics, dashboards, alerts, centralized logs, and operational documentation.

## Target lifecycle

```text
developer change -> main -> parallel backend/frontend checks
  -> build both images once -> scan -> publish shared version
  -> temporary deployment acceptance -> later promote same images to AWS ECS
  -> metrics/alerts -> centralized logs and operations
```

Final application architecture: Angular -> Nginx -> Spring Boot -> PostgreSQL. The later AWS target is Terraform-managed VPC/networking, ECS Fargate, Application Load Balancer, private RDS PostgreSQL, Secrets Manager, CloudWatch, and GitHub Actions authentication through OIDC. AWS may use ECR as a justified image destination or promotion step; Docker Hub remains the initial registry.

## Scope

- Keep Notes CRUD intentionally small and use it to exercise delivery concepts.
- Use Java 25, compatible stable Spring Boot, Maven Wrapper, stable Angular, Node.js 24 LTS/npm, PostgreSQL 17, Dockerfiles, Compose, GitHub Actions, Docker Hub, and lightweight Trivy scanning.
- Prefer compatible and accessible DHI; use explicit maintained upstream image tags where DHI is unavailable or impractical.
- Start with temporary Compose acceptance and curl, then add persistent ECS Fargate, Terraform, metrics/alerts, and centralized logging in separate milestones.
- Preserve the separation between source, built artifacts, release images, temporary acceptance, and persistent cloud deployment.

## Non-goals

- App product expansion, elaborate architecture, microservices, or a large test framework.
- EKS; Kubernetes is not the AWS target.
- Playwright, Cypress, Selenium, browser-based E2E, or a browser automation suite.
- Hadolint as a required gate.
- Persistent hosting in the current Compose acceptance pipeline.
- Starting with ELK or a heavy observability stack before delivery and cloud paths work.
- AWS resources or external accounts being provisioned as part of planning.

## Constraints and identity boundaries

- `main` is the protected/default integration branch; implementation has been on `devops-pipeline`. Confirm branch and state before each milestone.
- Personal GitHub CLI/Git identity, work-managed GHE Copilot entitlement, personal Docker Hub, and training-center AWS are distinct identities. Never copy credentials between them.
- Do not put tokens, passwords, AWS account IDs, private enterprise hosts, or proxy secrets in Git.
- Prefer GitHub Actions OIDC over long-lived AWS access keys. Keep Docker Hub token in GitHub repository secret settings, not workflow files.
- Never assume remote CI, registry, or cloud success from local validation or a branch push.

## Expected lifecycle and success criteria

The project succeeds when a learner can explain and demonstrate the pipeline, reproduce local checks, identify the exact shared frontend/backend release version, verify deployment with health and curl CRUD, promote the same artifacts instead of rebuilding, and later deploy and operate the service in AWS with safe cleanup. Objective evidence is defined in [definition of done](definition-of-done.md); current evidence and gaps are in [current state](current-state.md).
