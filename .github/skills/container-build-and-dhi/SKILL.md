---
name: container-build-and-dhi
description: Plan, implement, or validate one containerization milestone with verified DHI preference, explicit upstream fallbacks, and pull-only release Compose.
---

# Container build and DHI

## Start and prerequisites

Inspect `AGENTS.md`, current state, selected roadmap milestone, definition of done, both Dockerfiles, `.dockerignore` files, `compose.yaml`, `deploy/compose.yaml`, and health checks before changing anything. Confirm exact requested scope.

## Procedure and output

- Inspect the DHI catalog for each relevant base image; verify exact image/tag, platform, access, required tools, health-check behavior, and runtime compatibility. Never infer tag names.
- Prefer compatible, accessible, practical DHI. If unavailable, select a maintained official upstream image, pin an explicit version, and document the reason/fallback.
- Keep PostgreSQL an external maintained runtime image; do not build/publish a custom database image without a separate approved requirement.
- Prefer multi-stage builds, reproducible dependency inputs, non-root application runtime when practical, minimal runtime dependencies, health checks, and useful `.dockerignore`.
- Keep release Compose pull-only. Do not introduce Buildpacks; this project teaches Dockerfiles.

## Safety, validation, stop conditions

- Build only the named project image(s); inspect files and local resource ownership before running Compose. Never use `docker system prune` or delete unrelated containers/images/volumes.
- Never include credentials in build args, Dockerfiles, logs, or repository files. Do not add DHI secrets.
- Validate exact Dockerfiles by building them, inspecting image user/ports, running named Compose health/smoke checks, confirming release Compose has images and no `build:`, and cleaning only the disposable named project.
- Record blockers and upstream fallback. Stop if DHI access/tag is ambiguous, a proposed change alters another milestone, or cleanup/data scope is unclear.

See [architecture](../../../docs/architecture.md), [current state](../../../docs/current-state.md), and [Milestone 2](../../../docs/roadmap.md#milestone-2--production-oriented-containerization-partial).

## Invocation example

Use the /container-build-and-dhi skill to implement Milestone 2 only.
