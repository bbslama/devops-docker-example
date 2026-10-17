# Roadmap

Statuses are evidence-based; see [current state](current-state.md). Dates/effort estimates below are focused person-hours, not elapsed calendar time. No milestone should be combined with another without an explicit scope decision. Review dependencies and cleanup before execution.

| # | Milestone | Status |
| --- | --- | --- |
| 0 | Baseline and repository audit | COMPLETE (local evidence) |
| 1 | Minimal application baseline | COMPLETE (local evidence) |
| 2 | Production-oriented containerization | COMPLETE (CI + local runtime evidence; DHI blocked with fallback) |
| 3 | Continuous integration | PARTIAL |
| 4 | Image publication | PARTIAL |
| 5 | Deployment acceptance | PARTIAL |
| 6 | Pipeline hardening and promotion | PLANNED |
| 7 | AWS account readiness | PLANNED |
| 8 | Terraform foundation | PLANNED |
| 9 | AWS data and secret services | PLANNED |
| 10 | ECS Fargate deployment | PLANNED |
| 11 | GitHub Actions to AWS | PLANNED |
| 12 | Metrics and dashboards | PLANNED |
| 13 | Centralized logging | PLANNED |
| 14 | Operational maturity | PLANNED |
| Optional | Local Kubernetes compatibility | OPTIONAL |

## Milestone 0 — Baseline and repository audit (COMPLETE locally)

- **Objective / why:** establish the true code, branch, identity, toolchain, validation and remote-service state before work on another machine.
- **Dependencies:** none.
- **Deliverables:** clean baseline record; local prerequisites and account boundaries; credential and proxy checks that reveal no secret values; reproducible check commands; one evidence-backed next milestone.
- **Validation/evidence:** `git status`, branch/remotes/log, safe credential-presence checks, `java -version`, `node --version`, `npm --version`, `docker version`, `docker compose version`, `gh auth status` (without tokens), Copilot CLI availability, backend and frontend local checks.
- **Completion criteria:** correct repository/branch and local identity are confirmed; tests are reproducible or blockers recorded; no credentials are committed; proxy assumptions and account ownership are understood; current-state ledger updated.
- **Rollback/cleanup:** audit only; do not change proxy/global identity or remove files/configuration. No deployment.
- **Effort / risks:** 1–3 h. Risks: inherited credentials/proxy settings, Docker requiring sudo, unauthenticated tools.
- **Deferred:** implementation changes, external workflow dispatch, AWS resources.

## Milestone 1 — Minimal application baseline (COMPLETE locally)

- **Objective / why:** provide a small workload with health endpoints and minimal tests so delivery stages have something real to validate.
- **Dependencies:** M0.
- **Deliverables:** Angular, Spring Boot, PostgreSQL Notes CRUD; validation and migration; health endpoints; backend/frontend tests; reproducible local checks.
- **Validation/evidence:** `cd backend && ./mvnw clean verify`; `cd frontend && npm ci && npm run quality`; verify PostgreSQL Testcontainers result, test counts, build outputs, and endpoint behavior. Existing local records report 5 backend tests and 2 frontend tests passing.
- **Completion criteria:** app behavior and contract work; migration and health checks succeed; checks pass; evidence is logged. Scope is not expanded beyond necessary fixes.
- **Rollback/cleanup:** preserve baseline and migration history; temporary DB/test resources disposed by their owners.
- **Effort / risks:** 1–2 days. Risks: Java/Spring version compatibility and Docker-dependent integration test.
- **Deferred:** product features, browser E2E, production-scale design.

## Milestone 2 — Production-oriented containerization (COMPLETE; DHI blocked with documented fallback)

- **Objective / why:** package frontend/backend reproducibly with reasonable runtime defaults and a maintained PostgreSQL image.
- **Dependencies:** M1.
- **Deliverables:** multi-stage frontend/backend Dockerfiles, non-root runtime where practical, `.dockerignore`, explicit stable versions, health checks, DHI evaluation and documented upstream fallback, local build validation.
- **Validation/evidence:** inspect DHI catalog/architecture and access; build each committed Dockerfile; inspect image metadata and runtime user; `docker compose -f compose.yaml config`; exercise health and API in isolated local Compose project.
- **Completion criteria:** both committed Dockerfiles build from clean source without insecure TLS workarounds; images start and health checks work; DHI choice/fallback is evidence-backed; release Compose remains pull-only.
- **Rollback/cleanup:** clean only named test Compose project/volume after confirming data is disposable; retain prior known-good image tags; do not run `docker system prune`.
- **Effort / risks:** 0.5–1 day. Risks: local network/proxy restrictions, base-image runtime differences, native dependencies.
- **Deferred:** mandatory DHI where no practical compatible image exists, Buildpacks, Kubernetes.

## Milestone 3 — Continuous integration (PARTIAL)

- **Objective / why:** fail changes early with parallel backend/frontend checks before artifact publication.
- **Dependencies:** M1; M2 for later image jobs but not test jobs.
- **Deliverables:** backend Maven/JUnit/Checkstyle/coverage job; frontend lint/test/build job; parallel execution; useful reports; clear failure conditions; no publication before checks.
- **Validation/evidence:** validate workflow syntax locally; run matching tests; inspect a safe branch/manual CI run where allowed and save the run URL, job results, and artifacts.
- **Completion criteria:** both test jobs execute independently and are required by publication; failures stop dependents; reports are retrievable; no secrets are printed.
- **Rollback/cleanup:** revert only workflow/doc changes from this milestone if they prevent required checks; no infrastructure cleanup.
- **Effort / risks:** 0.5 day. Risks: runner tool versions, action permissions, integration test Docker availability.
- **Deferred:** AWS deployment, browser E2E, Hadolint.

## Milestone 4 — Image publication (PARTIAL)

- **Objective / why:** publish the same tested frontend/backend build under one discoverable release version.
- **Dependencies:** M2 and M3; Docker Hub ownership, repository and credentials must be explicitly verified.
- **Deliverables:** build both images once, shared `1.0.${{ github.run_number }}`, numbered plus `latest` convenience tags, Docker Hub login via repository variable/secret, lightweight Trivy scan, release-version workflow summary. Do not publish PostgreSQL.
- **Validation/evidence:** authorized Actions run URL; test gates pass; scan status; push logs; Docker Hub tag/digest inspection; pull exact numbered tag in a clean environment. Do not expose token.
- **Completion criteria:** both images are published under matching release tag only after gates/scan; workflow summary identifies version; actual registry state confirms tags; version is not represented as immutable without enforcement.
- **Rollback/cleanup:** never overwrite or delete an existing published release intentionally; record known-good previous version. Remove only test containers; registry cleanup requires explicit user approval.
- **Effort / risks:** 0.5–1 day. Risks: missing Docker Hub configuration, registry policy/rate limits, tag collision on Actions re-run, Trivy database access.
- **Deferred:** database image publication, AWS ECR migration, semantic release design until needed.

## Milestone 5 — Deployment acceptance (PARTIAL)

- **Objective / why:** verify the exact published artifact works in a temporary multi-container runtime, separately from builds.
- **Dependencies:** M4 and exact pullable release.
- **Deliverables:** pull-only Compose, PostgreSQL health/persistence, backend/frontend health and service connectivity, GitHub-hosted temporary deploy, bounded curl health + CRUD smoke, unconditional cleanup.
- **Validation/evidence:** Compose resolved config has no `build`; authorized Actions run shows pull of both exact versioned images, healthy services, passing smoke test, cleanup/down result.
- **Completion criteria:** clean temporary deployment pulls the stated version, all health checks pass, smoke creates/reads/deletes, cleanup runs on success and failure.
- **Rollback/cleanup:** always remove only the uniquely named acceptance project and disposable DB volume; production rollback is not part of this milestone.
- **Effort / risks:** 0.5–1 day. Risks: image visibility, version mismatch, runner networking/health-check behavior, cleanup failures.
- **Deferred:** persistent hosting, AWS, browser E2E.

## Milestone 6 — Pipeline hardening and promotion (PLANNED)

- **Objective / why:** promote reviewed artifacts predictably and prevent accidental release replacement.
- **Dependencies:** M3–M5 validated.
- **Deliverables:** immutable identifiers (release tags and/or digests), uniqueness protection, caching review, protected environment/manual promotion, previous-version rollback instructions, build-once-deploy-many.
- **Validation/evidence:** prove same image digests are used in acceptance and promotion; demonstrate duplicate/re-run prevention and approval gates; record a non-production rollback drill.
- **Completion criteria:** release identity cannot silently move; deployments do not rebuild; promotion approvals and rollback evidence are clear.
- **Rollback/cleanup:** retain last-known-good digest; revert pipeline config without republishing a changed artifact; do not delete registry versions as cleanup.
- **Effort / risks:** 0.5–1.5 days. Risks: GitHub environment policy and registry tag immutability support.
- **Deferred:** semantic versioning unless project release needs justify it; AWS deployment itself.

## Milestone 7 — AWS account readiness (PLANNED)

- **Objective / why:** confirm training account access and cost/permission feasibility before provisioning.
- **Dependencies:** M6 conceptual release process; account owner/training-center guidance.
- **Deliverables:** approved identity/auth method, account/region confirmation without writing account IDs to Git, IAM/quota limits, budget/cost ceiling, naming/tags, OIDC feasibility, Terraform backend/state plan, resource destruction plan.
- **Validation/evidence:** user-approved read-only AWS identity/caller/region/quota/budget checks; approved OIDC configuration path; written cost and teardown checklist.
- **Completion criteria:** account ownership, permitted region, role permissions, cost boundaries and state strategy are explicit; no unresolved authorization ambiguity.
- **Rollback/cleanup:** readiness is read-only; revoke temporary sessions normally, create no resources.
- **Effort / risks:** 2–5 h. Risks: training account restrictions, cost ceilings, no permission for OIDC/IAM or networking.
- **Deferred:** all resource creation and changes.

## Milestone 8 — Terraform foundation (PLANNED)

- **Objective / why:** make reviewed, repeatable, cost-aware network and compute foundation as code.
- **Dependencies:** M7 approved; state backend and region strategy settled.
- **Deliverables:** provider/version constraints; state design; environment layout; tags/names; VPC, public/private subnets, route tables, internet gateway, NAT decision, security groups, ECS cluster, ALB scaffolding and ECR decision as selected.
- **Validation/evidence:** `terraform fmt -check`, `terraform init` using approved backend, `terraform validate`, reviewed `terraform plan`; no apply without explicit authorization.
- **Completion criteria:** plan is understood, least-privilege paths are explicit, cost and teardown reviewed, state is protected and not committed.
- **Rollback/cleanup:** maintain plan and destroy sequence; apply only approved foundation; later destroy only with explicit authorization and state backup/review.
- **Effort / risks:** 1–3 days. Risks: NAT/ALB cost, quota, state locking/secrets, accidental public exposure.
- **Deferred:** RDS, app tasks, persistent traffic, EKS.

## Milestone 9 — AWS data and secret services (PLANNED)

- **Objective / why:** add a private, durable database and safe runtime secret delivery.
- **Dependencies:** M8 networking/state.
- **Deliverables:** RDS PostgreSQL (or justified alternative), subnet group/private placement, Secrets Manager, least-privilege network/IAM, backups/deletion protection decisions, cost sizing, migration procedure.
- **Validation/evidence:** reviewed plan, DB private reachability only from intended tasks, secret reference tested without revealing value, backup/restore test evidence.
- **Completion criteria:** app connectivity and migration design are validated; password is absent from Git, logs, and Terraform source/state outputs; backup and deletion behavior understood.
- **Rollback/cleanup:** snapshot/retention and data destruction reviewed; no RDS deletion until explicit approval.
- **Effort / risks:** 1–2 days. Risks: persistent cost, data loss, secret leakage, schema migration failure.
- **Deferred:** production data guarantees beyond training needs.

## Milestone 10 — ECS Fargate deployment (PLANNED)

- **Objective / why:** run the exact released app version persistently with managed load balancing and health.
- **Dependencies:** M6, M8, M9.
- **Deliverables:** frontend/backend ECS task definitions and services, ALB/target groups, health checks, execution/task IAM roles, Secrets Manager wiring, RDS access, CloudWatch log groups, exact image version.
- **Validation/evidence:** reviewed plan/deployment, ECS service stability, target health, externally reachable UI/API health, cloud curl CRUD smoke, deployed image digest/version.
- **Completion criteria:** stable tasks run exact promoted artifacts, health and smoke succeed, logs are available, network and secret boundaries hold.
- **Rollback/cleanup:** redeploy prior exact version/digest; preserve DB; destroy only approved disposable resources.
- **Effort / risks:** 2–4 days. Risks: routing, ALB target health, task sizing, RDS startup/migrations, cost.
- **Deferred:** EKS and autoscaling until required.

## Milestone 11 — GitHub Actions to AWS (PLANNED)

- **Objective / why:** automate approved ECS deployments without long-lived AWS keys.
- **Dependencies:** M7 and M10.
- **Deliverables:** GitHub OIDC provider/trust, restricted IAM role, least privilege, exact artifact promotion/copy to ECR if selected, ECS update, stability wait, cloud smoke, deployed version summary, rollback.
- **Validation/evidence:** approved workflow run with id-token only on deployment job; CloudTrail/IAM evidence for intended role; ECS stable task version and passing smoke.
- **Completion criteria:** trust is limited to exact repo and branch/environment; no AWS access-key pair in secrets; least privileges and approvals verified.
- **Rollback/cleanup:** disable deployment workflow/role trust if unsafe; rollback to prior version and preserve service.
- **Effort / risks:** 1–2 days. Risks: overly broad trust or policy, artifact provenance changes, credential scope.
- **Deferred:** multi-account promotion unless needed.

## Milestone 12 — Metrics and dashboards (PLANNED)

- **Objective / why:** make runtime health and service behavior visible after stable deployment.
- **Dependencies:** M10; M11 preferred for repeatable environment changes.
- **Deliverables:** Actuator/Prometheus-compatible metrics, collection design, Grafana or AWS-managed dashboards, requests/latency/errors/JVM/container/DB panels and actionable alerts.
- **Validation/evidence:** dashboard accessible to authorized users; panel values change under traffic; test outage/high-error alert fires and resolves.
- **Completion criteria:** metric sources, retention, alert ownership/cost, dashboard use, and test evidence documented.
- **Rollback/cleanup:** disable test alerts and remove experimental collectors/dashboard only with scoped cleanup; preserve app service.
- **Effort / risks:** 1–3 days. Risks: cardinality, data retention cost, network/auth exposure, alert noise.
- **Deferred:** centralized logging and ELK.

## Milestone 13 — Centralized logging (PLANNED)

- **Objective / why:** searchable, correlated operational evidence without leaking secrets.
- **Dependencies:** M10; M12 recommended.
- **Deliverables:** structured JSON app logs, correlation/request IDs where practical, CloudWatch initial AWS destination, retention, searchable errors, log dashboards/alerts; later compare ELK/OpenSearch.
- **Validation/evidence:** test request traced through logs, filters find expected error, secret-redaction test, retention configuration review.
- **Completion criteria:** search and access controls work; no sensitive values emitted; retention/cost is approved.
- **Rollback/cleanup:** disable ingestion or revert logging format in scoped manner; preserve incident evidence per policy.
- **Effort / risks:** 1–3 days. Risks: data exposure, ingestion cost, high-volume/cardinality.
- **Deferred:** ELK until AWS delivery is stable and the operational case is justified.

## Milestone 14 — Operational maturity (PLANNED)

- **Objective / why:** make the training deployment understandable to a new operator and recoverable.
- **Dependencies:** M10–M13.
- **Deliverables:** deployment/rollback runbooks, incident checklist, cost cleanup, dependency-update process, backup/restore results, DR assumptions, final architecture and demo script.
- **Validation/evidence:** another operator follows runbook in a drill; rollback and restore are demonstrated; cost teardown is confirmed.
- **Completion criteria:** procedures are current, tested, and identify owner/approval boundaries; no fabricated recovery claims.
- **Rollback/cleanup:** retain audit/run evidence; cleanup only owned resources after data and retention approval.
- **Effort / risks:** 1–2 days. Risks: untested assumptions, stale runbooks, data retention/deletion.
- **Deferred:** production SLA claims beyond demonstrated controls.

## Optional milestone — Local Kubernetes compatibility (OPTIONAL)

- **Objective / why:** optional educational comparison using kind and existing release images; it does not advance or block ECS.
- **Dependencies:** stable image release and explicit user interest.
- **Deliverables:** minimal manifests or Helm, local kind path, health/readiness and smoke validation, optional CI validation.
- **Validation/evidence:** deployment uses exact published images and passes health/smoke in kind.
- **Completion criteria:** learning objective is clear and no EKS commitment is introduced.
- **Rollback/cleanup:** delete only the named local cluster/namespace after confirming it is disposable; do not prune unrelated Docker resources.
- **Effort / risks:** 1–3 days. Risks: distraction from ECS, local resource needs, drift between platforms.
- **Deferred:** EKS; Kubernetes is not a prerequisite for AWS.
