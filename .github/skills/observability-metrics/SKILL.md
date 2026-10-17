---
name: observability-metrics
description: Plan or implement post-deployment metrics, Prometheus-compatible collection, Grafana/AWS-managed dashboards, and tested alerts without adding centralized logging.
---

# Observability metrics

## Start and prerequisites

Inspect current state, architecture, roadmap, deployed runtime, Actuator configuration, account permissions, metric exposure/auth/network boundary, cost and user-approved milestone. Confirm stable deployment (M10) exists before adding collection infrastructure.

## Procedure and expected output

Design only necessary, low-cardinality metrics and panels: request count, latency, error rate, JVM memory/health, container availability, database connectivity. Compare AWS-managed and self-hosted Prometheus/Grafana against training objectives, access, cost, retention, and operational burden. Specify data sources, scrape/auth path, dashboard panels, alert thresholds/owners, test procedure, and cleanup.

Implement only when explicitly requested. Keep health/metrics endpoints private or appropriately authenticated; never expose sensitive actuator data publicly.

## Safety, validation, stop conditions

- This skill does not implement log shipping, ELK, or centralized logging; that is a later distinct milestone.
- No cloud resources or changes without explicit authorization and reviewed cost/plan.
- Validate that metrics update under representative traffic; test alert fire and recovery; inspect access, cardinality, retention, and spend. Remove only named temporary test alarms/resources.
- Stop if deployed baseline, metric permissions, alert ownership, data exposure, or cost ceiling is unclear.
- Report evidence and blockers; update current state after validation.

See [architecture](../../../docs/architecture.md), [security](../../../docs/security-and-identities.md), and [Milestone 12](../../../docs/roadmap.md#milestone-12--metrics-and-dashboards-planned).

## Invocation example

Use the /observability-metrics skill to plan the first operational dashboard.
