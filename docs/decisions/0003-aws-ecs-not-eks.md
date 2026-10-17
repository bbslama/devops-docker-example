# ADR 0003: AWS ECS Fargate, not EKS

- **Status:** Accepted
- **Context:** The project needs cloud container deployment learning while keeping operational complexity appropriate to a training project.
- **Decision:** Use Amazon ECS Fargate as the initial cloud runtime. EKS is not planned.
- **Consequences:** The AWS path focuses on IAM, VPC networking, task definitions, services, load balancing, RDS, deployment stability, and cost cleanup without operating a Kubernetes control plane.
- **Alternatives considered:** EKS; rejected as unnecessary complexity for this objective. Local Kubernetes remains optional only and cannot block the ECS path.
