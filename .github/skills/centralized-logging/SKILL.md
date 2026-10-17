---
name: centralized-logging
description: Plan or implement structured, redacted, searchable centralized logs after cloud deployment and metrics are stable.
---

# Centralized logging

## Start and prerequisites

Inspect current state, security/identity guidance, architecture, deployed logging path, metrics status, retention requirements, access controls, cost, and requested milestone. Confirm cloud deployment and operational owner exist before implementation.

## Procedure and expected output

Plan structured JSON logs, correlation/request IDs where practical, CloudWatch as initial AWS collection, searchable errors, retention, access, dashboards/alerts, and measured cost. Compare OpenSearch/ELK only when a defined training or operational need justifies its added resources. Include sample redacted event format, data flow, retention/deletion policy, search/alert examples, validation, and rollback.

Implement only explicitly requested in-scope changes; keep logging separate from metrics dashboards.

## Safety, validation, stop conditions

- Never log passwords, tokens, authorization headers, personal data, proxy credentials, or secret values. Validate redaction with a deliberate safe test before expanding collection.
- No cloud resources or data routing without explicit authorization and cost/retention review.
- Verify a test request is searchable with correlation, expected error query works, retention/access policies apply, and secret-redaction test passes.
- Stop if data classification, access policy, retention, ingestion cost, or log ownership is uncertain.
- Do not claim ELK/OpenSearch/CloudWatch implementation from a plan. Record evidence, cleanup, and current state only after validation.

See [security and identities](../../../docs/security-and-identities.md), [architecture](../../../docs/architecture.md), and [Milestone 13](../../../docs/roadmap.md#milestone-13--centralized-logging-planned).

## Invocation example

Use the /centralized-logging skill to compare ELK with AWS-native logging for this project.
