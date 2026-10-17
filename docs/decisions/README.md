# Architecture decision records

These short records document project direction, constraints, and tradeoffs. They do not prove that a future capability has been implemented or validated.

| ADR | Decision |
| --- | --- |
| [0001](0001-build-once-deploy-many.md) | Build application images once and promote the same artifacts. |
| [0002](0002-docker-hub-and-versioning.md) | Docker Hub initially; shared numbered version; `latest` convenience only. |
| [0003](0003-aws-ecs-not-eks.md) | ECS Fargate is the AWS target; EKS is not planned. |
| [0004](0004-dhi-preference.md) | Prefer practical DHI; otherwise use verified maintained upstream images. |
| [0005](0005-no-browser-e2e.md) | No browser E2E; minimal tests and curl deployment acceptance. |
| [0006](0006-observability-phasing.md) | Delivery and cloud deployment precede metrics, then centralized logging. |

## Status convention

`Accepted` means the project direction is chosen; it does not mean the capability is complete. Revisit an ADR with a new numbered record rather than silently changing the underlying decision. Link evidence and affected roadmap milestone in any future amendment.
