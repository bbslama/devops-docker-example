# ADR 0004: Prefer Docker Hardened Images when practical

- **Status:** Accepted
- **Context:** Hardened base images can reduce maintenance and attack surface, but compatible tags, architectures, access, and runtime behavior must be established.
- **Decision:** Prefer a DHI when it is verified in the catalog, accessible, supports required version/architecture, and works as a practical replacement. Otherwise use an official maintained upstream image with an explicit version and document the fallback. Do not guess DHI image names or require DHI access to progress.
- **Consequences:** Each image evaluation records source, tag/digest, architecture, access, health/runtime compatibility, and reason for selection. Never put DHI credentials in the repository.
- **Alternatives considered:** Guess likely DHI names (rejected); block work until DHI available (rejected); explicit maintained upstream fallback (accepted).
