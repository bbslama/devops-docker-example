# ADR 0001: Build once, deploy many

- **Status:** Accepted
- **Context:** Rebuilding separately for acceptance and later environments risks deploying different bytes under the same apparent source version.
- **Decision:** Build the frontend and backend images once, record their release identity, and promote those same image digests through temporary acceptance and later AWS deployment. Environments do not rebuild the application.
- **Consequences:** Pipeline must transport an exact immutable identity (prefer digest or enforced-unique release reference), record it, and deploy that identity. The current run-number tag alone does not enforce immutability; M6 must close that gap before claiming the decision is realized.
- **Alternatives considered:** Rebuild each environment; rejected due artifact drift. Buildpacks; rejected in favor of the explicit Dockerfile learning goal.
