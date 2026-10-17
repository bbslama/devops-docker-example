# Security and identities

## Separate principals

| System | Ownership / purpose | Boundary |
| --- | --- | --- |
| Personal GitHub | Repository and GitHub CLI account for `bbslama/devops-docker-example` | Personal Git identity/auth remains separate from work Copilot sign-in. |
| Work-managed GHE Copilot | Copilot entitlement/account | Do not use it as a substitute for personal GitHub repository ownership or copy its tokens. Keep enterprise hostnames out of project docs. |
| Docker Hub | Personal registry account | Use a scoped Docker Hub access token, not an account password; store it only as the GitHub repository secret. |
| AWS | Training-center account, later | Confirm authorization with account owner. Prefer approved SSO/temporary auth and GitHub OIDC; avoid long-lived access-key pairs. |

These identities must not share credentials or sessions intentionally. Never write actual usernames (other than public repo owner when relevant), tokens, passwords, AWS account IDs, private hostnames, proxy URLs, or secret values to repository files or logs.

## Secret and access policy

- Current pipeline names repository variable `DOCKERHUB_USERNAME` and secret `DOCKERHUB_TOKEN`. The variable is not secret; the token is. Confirm presence and validity only through approved GitHub settings/run behavior. Never display token values.
- Do not create secrets during an audit or planning task. Do not paste secrets into commands, prompt logs, workflow files, `.env.example`, issues, screenshots, or test output.
- `.env.example` contains placeholders only. Local `.env` files must remain ignored and untracked; replace sample passwords before local use. Do not rely on a local password as a production secret.
- Future AWS access should use OIDC trust scoped to the exact repository and intended branch/environment, with least-privilege IAM. Limit `id-token: write` to the deployment job that requires it.
- Terraform state and plan files can contain sensitive values. Choose an approved protected backend, locking/encryption/access control; do not commit state, plans, or secret-bearing tfvars.
- Runtime credentials belong in Secrets Manager or an approved secret manager. Pass secret references, not literals, to task definitions.
- Least privilege applies to GitHub workflow permissions, registry tokens, IAM roles, security groups, service-to-service traffic, and log access.
- Avoid logging request secrets, authorization headers, database passwords, tokens, and sensitive personal data. Add redaction tests before centralized logging.

## Proxy and network configuration

The development laptop used previously was behind enterprise proxy/firewall restrictions, including blocked SSH connectivity; HTTPS through GitHub CLI worked. These constraints are historical context, not instructions to embed proxy settings. Never persist work proxy configuration in this repository and never create scripts that blindly remove global proxy settings.

On another computer, inspect whether proxy configuration exists before considering changes. Potential locations: `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY` and lowercase variants; Git `http.proxy`/`https.proxy`; npm `proxy`/`https-proxy`; Maven `settings.xml`; Docker daemon/systemd proxy drop-ins; shell startup files. Check presence without printing values. If a setting is confirmed obsolete, ask the user before removing that exact setting. Never print URLs that may include credentials.

## Personal Ubuntu readiness checklist

- [ ] Clone this repository through the personal GitHub account; confirm expected remote URL.
- [ ] Inspect current branch, clean/dirty worktree, and recent commits.
- [ ] Verify local Git name/email deliberately; do not silently change global Git identity.
- [ ] Check installed Java 25, Node 24/npm, Docker Engine, Compose v2, GitHub CLI, and Copilot CLI versions.
- [ ] Verify Docker works for the intended user without `sudo`; if not, explain privilege implications and ask before changing groups.
- [ ] Check personal GitHub CLI authentication status without displaying tokens; separately confirm Copilot CLI uses the work-managed entitlement without copying credentials.
- [ ] Check Docker Hub access using the personal registry identity without exposing a token.
- [ ] Inspect proxy settings by name/presence only across shell, Git, npm, Maven, and Docker/systemd; change nothing without explicit authorization.
- [ ] Verify public GitHub, Docker Hub, and DHI catalog access; evaluate exact image availability, tag, architecture and runtime fit before use.
- [ ] For later AWS work, confirm training account authorization, permitted region, approved SSO/temporary auth, budget, quotas, OIDC permissions, and cleanup policy. Do not create resources during readiness checks.
- [ ] Do not inherit work passwords, SSH keys, personal access tokens, or proxy credentials.

For the audit procedure see [project-state-audit](../.github/skills/project-state-audit/SKILL.md) and [local-environment-readiness](../.github/skills/local-environment-readiness/SKILL.md).
