# Operations runbook

Commands in this runbook are scoped to local training or to resources the user explicitly owns and authorizes. This is not production guidance. Never paste credential values into a command, terminal transcript, issue, or repository file. Do not run cleanup against an unverified project/context.

## Local validation

```sh
cd backend
./mvnw --batch-mode --no-transfer-progress clean verify

cd ../frontend
npm ci
npm run quality
```

The integration test needs Docker. If it fails, capture the failing test and safe Docker/network status; do not skip it as a workaround without recording the blocker. For backend/frontend workflow failures, inspect the relevant job log and test artifacts before changing code.

## CI workflow investigation

The workflow is `.github/workflows/ci-cd.yml`. It triggers automatically on pushes to `main` and supports manual dispatch. A feature branch push alone does not execute it. Do not manually dispatch unless authorized.

1. In GitHub Actions, select the exact run and record its URL, commit SHA, event, branch, run number and generated app version.
2. Inspect `backend-test` and `frontend-test` independently; publication depends on both.
3. If `build-publish` failed, inspect image build logs, Trivy scan output/database result, registry login/push stage, and the step summary. Never print secret values.
4. If `deploy` failed, capture Compose status and logs from that same run, exact `APP_VERSION`, healthcheck state, smoke failure stage, and cleanup result.
5. Record PASS/FAIL/BLOCKED/SKIPPED evidence in `docs/current-state.md`. A green local run is not a substitute for remote run evidence.

## Docker Hub image inspection (when authorized)

Current names:

```text
<DOCKERHUB_USERNAME>/devops-example-backend:<APP_VERSION>
<DOCKERHUB_USERNAME>/devops-example-frontend:<APP_VERSION>
```

Use Docker Hub UI or `docker buildx imagetools inspect` against the exact repository/tag to establish that it exists and record its digest. Do not treat the `latest` alias as a release identifier. Never display login tokens. Do not create repositories or change visibility without explicit authorization.

## Pull an exact release

Fill `DOCKERHUB_USERNAME`, `APP_VERSION`, `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` in the shell or in a private ignored env file. Check the configured values' presence without printing secret values. The current deploy job requires images pullable without a registry login.

```sh
docker compose -f deploy/compose.yaml config --quiet
docker compose -f deploy/compose.yaml pull
```

Record the exact tag and digest pulled. Release Compose is expected to be pull-only and must not contain `build:`. The workflow uses `1.0.${{ github.run_number }}`; a rerun reuses that run number, so tags are not registry-enforced immutable identifiers.

## Local Compose deployment and smoke test

Use a disposable local-only password in `deploy/.env`; never commit it. Confirm the Compose project and named database volume belong to this test before cleanup.

```sh
cp deploy/.env.example deploy/.env
# Replace the sample local password using a safe editor, not a command recorded in shell history.
docker compose --env-file deploy/.env -f compose.yaml config --quiet
docker compose --env-file deploy/.env -f compose.yaml up --build -d --wait
docker compose --env-file deploy/.env -f compose.yaml ps
scripts/smoke-test.sh
docker compose --env-file deploy/.env -f compose.yaml logs --no-color
```

Smoke acceptance covers the frontend, backend health through Nginx, and note create/read/delete. If the host HTTP proxy intercepts loopback, inspect bypass behavior safely or run the smoke script from an approved container in the Compose network; do not conclude that remote deployment behaves the same.

## Status, logs, and cleanup

```sh
docker compose --env-file deploy/.env -f compose.yaml ps
docker compose --env-file deploy/.env -f compose.yaml logs --no-color
docker compose --env-file deploy/.env -f compose.yaml down
```

`down --volumes` deletes the Compose database volume and its data. Only use it after verifying project identity and confirming that the data is disposable:

```sh
docker compose --env-file deploy/.env -f compose.yaml down --volumes
```

Do not use `docker system prune`, broad container/volume selectors, or commands that could affect unrelated projects. The temporary GitHub deployment should clean its uniquely named Compose project in an unconditional step; verify it did so in the workflow log.

## Roll back to a previous numbered release

**PLANNED operational procedure; not validated against a production service.** On a service where a previous release is confirmed available, set `APP_VERSION` to the last-known-good numbered version and redeploy the same `deploy/compose.yaml` stack. Verify pulled digests, service health, and curl smoke. Preserve the database; application rollback does not reverse schema changes. Stop and seek review if a migration is not backward compatible or the prior version is unknown. Do not switch to `latest`, retag images, or delete the failed release to recover service.

## Terraform (PLANNED — no current Terraform configuration)

No resource names or backend are specified yet. After M7 readiness and approved M8 work, use only the explicitly selected working directory and account:

```sh
terraform fmt -check -recursive
terraform init
terraform validate
terraform plan -out=review.tfplan
```

Inspect the full plan and state/backend before any apply. `apply` and `destroy` change cloud resources and require explicit authorization plus reviewed cost/data-loss consequences. Plan/state files may contain sensitive values; keep them out of Git and use the approved protected backend.

## ECS status and CloudWatch logs (PLANNED)

No ECS cluster/service/log-group names are known and none are asserted. After M10, obtain names from reviewed Terraform outputs or approved console configuration, then inspect:

```sh
aws ecs describe-services --cluster <approved-cluster> --services <approved-service>
aws ecs describe-tasks --cluster <approved-cluster> --tasks <task-arn>
aws logs tail <approved-log-group> --since 15m
```

Use an approved AWS session; do not include account IDs or task details containing sensitive values in committed docs. Verify service stability, task definition image versions/digests, target health, and application health. Keep log output free of secrets.

## Monitoring checks (PLANNED)

No dashboards or alerts exist yet. After M12, verify dashboard data freshness, request rate, latency, errors, JVM/container health, database availability, alert delivery, and recovery. Record alert test evidence and confirm temporary test alarms are removed. Do not fabricate dashboard URLs or resource names.

## Incident evidence and escalation

Identify the failing stage first: source/tests, image build/scan/push, pull, Compose health, smoke, ECS deployment, database, metrics, or logging. Preserve exact version, timestamps, run URL/commit, status and redacted logs. If service availability matters, restore a known-good exact version first with authorization, then investigate. Never dump environment variables, tokens, secret values, or proxy URLs. Follow [incident-and-rollback](../.github/skills/incident-and-rollback/SKILL.md).
