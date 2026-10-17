# ADR 0005: No browser-based end-to-end suite

- **Status:** Accepted
- **Context:** The application is a small workload for learning automated container delivery; the delivery smoke test should be fast and easy to understand.
- **Decision:** Do not add Playwright, Cypress, or Selenium. Keep minimal backend/frontend unit, controller, and service tests. Deployment acceptance uses health checks and curl for frontend availability, proxied backend health, and one record create/read/delete cycle.
- **Consequences:** The smoke test proves HTTP/service integration, not browser rendering or full user interaction. Do not claim UI/browser coverage.
- **Alternatives considered:** Browser automation (rejected as out of scope); curl smoke and focused unit/component/service tests (chosen).
