# ADR 0002: Docker Hub and application versioning

- **Status:** Accepted
- **Context:** The training lifecycle needs an external container registry and a single identifiable frontend/backend release.
- **Decision:** Docker Hub is the initial registry. Both application images share `1.0.${{ github.run_number }}`; `latest` is a convenience alias only. Deployment and smoke acceptance use the numbered release, never `latest`. ECR may be added later if the AWS path benefits from registry-local artifacts.
- **Consequences:** Docker Hub ownership and a scoped token are prerequisites for publication; deployment must be able to pull the exact version. The deploy workflow currently does not authenticate to Docker Hub, so public/anonymous pulls are required. GitHub reruns reuse a run number; current tags are mutable and must not be described as immutable. M6 evaluates unique tags/digests without rebuilding.
- **Alternatives considered:** Docker Hub from the start (chosen for training); ECR-only (deferred to AWS); `latest` deployment (rejected because mutable).
