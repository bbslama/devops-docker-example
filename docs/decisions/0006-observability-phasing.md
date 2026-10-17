# ADR 0006: Phase observability after delivery and deployment

- **Status:** Accepted
- **Context:** Operating dashboards and log-search platforms before a reliable delivery and cloud runtime path adds cost and distracts from core learning.
- **Decision:** Complete and validate delivery pipeline first, then AWS deployment, then metrics/dashboards/alerts, followed by centralized logging. Start AWS log collection with CloudWatch; evaluate ELK/OpenSearch later against training goals and cost.
- **Consequences:** Actuator health/info in the current app is not full observability. Metrics and centralized logging remain separate roadmap milestones. Avoid an oversized self-hosted stack before the workload is stable.
- **Alternatives considered:** Build Prometheus/Grafana/ELK immediately (rejected); stage metrics after AWS and logging after that (chosen); AWS-managed services (to be evaluated against permission, cost, and educational goals).
