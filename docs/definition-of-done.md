# Definition of done

Milestones advance only on objective evidence. A source file, an authored workflow, a configured secret name, or a local build alone does not establish downstream behavior. Record exact commands or authoritative run/resource references in `docs/current-state.md`; redact credential values and private account identifiers.

## Evidence levels

- **Implemented:** repository contains reviewed source/configuration.
- **Local:** command/test ran locally against identified code and returned the recorded result.
- **CI:** GitHub Actions run URL and required job results are recorded.
- **Registry:** exact registry repository/tag/digest was inspected and, where applicable, pulled.
- **Deployment:** named temporary/persistent environment health and smoke results are available.
- **Cloud:** approved account/region, Terraform plan/apply and live service evidence; do not include private account IDs in Git.

Never translate evidence at one level into a claim at a higher level. Report results as PASS, FAIL, BLOCKED, or SKIPPED, with reasons and cleanup.

## Milestone-specific completion criteria

| Milestone | Required completion evidence |
| --- | --- |
| 0 — Baseline audit | Repository/branch/remotes/status; toolchain check results; safe credential/proxy-presence audit; local command reproducibility or blockers; current-state entry; one next milestone. |
| 1 — App baseline | Backend unit/controller and real PostgreSQL integration results; frontend lint/tests/build results; API/migration/health behavior verified; no broad app scope. |
| 2 — Containerization | Both committed Dockerfiles build from source; image user/ports/health inspected; isolated local Compose start/health/CRUD; DHI catalog/access/version evidence or documented maintained-upstream fallback; cleanup confirmed. |
| 3 — CI | Workflow parses; a permitted Actions run URL shows independent parallel jobs, required failures block dependents, artifacts are accessible, and no credentials leak. |
| 4 — Publication | Actions run passes tests and scan; version summary recorded; both Docker Hub images show matching release tag and inspectable digest; exact numbered images pull in clean runtime. |
| 5 — Acceptance | Run pulls exact published numbered images with no build; DB/backend/frontend healthy; curl smoke passes create/read/delete; cleanup occurs on success and failure; run URL and version recorded. |
| 6 — Hardening/promotion | Duplicate/rerun cannot silently replace release identity; acceptance and promotion use same digests; approval gate and previous-version rollback drill evidenced. |
| 7 — AWS readiness | Approved account identity/region/quota/budget/permissions, state/OIDC path and cleanup plan recorded; readiness checks are read-only; no resources created. |
| 8 — Terraform foundation | `fmt -check`, `init`, `validate`, and reviewed `plan` succeed; state secure; cost/network/teardown reviewed; apply separately authorized. |
| 9 — Data/secrets | Approved plan; private DB access tested; secret retrieval works without disclosure; migration, backups, and restore evidence exist; password absent from source/logs/outputs. |
| 10 — ECS | Task/service versions and digests match release; service reaches stable; ALB targets healthy; cloud smoke passes; CloudWatch logs available; costs and cleanup documented. |
| 11 — GitHub-to-AWS | OIDC claim restriction and least-privilege policy reviewed; deployment run assumes only intended role; no AWS key pair stored; ECS stable and smoke/version summary verified; rollback known. |
| 12 — Metrics | Dashboard populated with meaningful values; request, latency, errors, JVM, container, DB panels checked; alert fire and recovery test recorded; retention/access/cost approved. |
| 13 — Logging | Structured/correlated log sample verified; expected errors searchable; redaction test passes; access/retention/cost reviewed; no secrets in logs. |
| 14 — Operations | A second operator follows runbook; rollback, backup/restore, incident and teardown exercises completed; evidence and limitations documented. |
| Optional Kubernetes | Named local kind deployment uses exact release images; health/smoke passes; cluster cleanup verified; no effect on ECS milestones. |

## Validation and cleanup record template

```markdown
### Milestone N — YYYY-MM-DD
- **Implementation:** paths/revision or documentation-only.
- **Local:** PASS/FAIL/BLOCKED/SKIPPED — command and concise result.
- **CI:** PASS/FAIL/BLOCKED/SKIPPED — Actions run URL and job(s), or not run.
- **Registry:** PASS/FAIL/BLOCKED/SKIPPED — exact image tag/digest/pull evidence.
- **Deployment/cloud:** PASS/FAIL/BLOCKED/SKIPPED — environment and health/smoke/plan evidence.
- **Cleanup:** PASS/FAIL/BLOCKED/SKIPPED — exact named temporary resources removed or retained with reason.
- **Remaining issues:** evidence-backed list.
- **Next milestone:** exactly one recommendation.
```

For live operational commands, see [operations runbook](operations-runbook.md). For current known evidence, see [current state](current-state.md).
