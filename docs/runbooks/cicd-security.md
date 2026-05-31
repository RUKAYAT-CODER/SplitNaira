# CI/CD Security Runbook

Operational guidance for supply-chain alerts, leaked secrets, and pipeline incidents.

## Pipeline Overview

| Workflow | Purpose | Security gate |
|----------|---------|---------------|
| `ci.yml` | PR/push validation | data-integrity, lint, test, build, `security-audit`, `cargo audit` |
| `codeql-analysis.yml` | SAST | JavaScript/TypeScript security queries |
| `dependency-audit.yml` | Weekly npm audit | Fails on high+ severity |
| `backend-deploy.yml` | Staging CD | Runs only after CI succeeds on `main`; post-deploy smoke optional |
| `mainnet-deploy.yml` | Production CD | Manual only; GitHub `production` environment |

## Dependency CVE Triage

1. Check failing job output (`security-audit` or `dependency-audit`).
2. Identify affected workspace (`backend` or `frontend`).
3. Prefer Dependabot PR or `npm audit fix` with review.
4. If no fix exists, document risk acceptance in the PR until upstream patches land.

## Leaked Secret Response

1. **Rotate immediately** — Render deploy hooks, `STELLAR_SECRET_KEY`, JWT secrets, database URLs.
2. Revoke the exposed credential in the provider console.
3. Search git history; if committed, treat as compromised even after removal.
4. Re-run deploy workflows after rotation.

## Workflow Compromise

1. Disable affected workflow in GitHub Actions settings.
2. Review recent workflow runs for unexpected `contents: write` usage.
3. Audit `.github/workflows/` diffs on `main` for the last 7 days.
4. Restore from last known-good commit if malicious steps are found.

## Rollback

| Change type | Rollback |
|-------------|----------|
| CI workflow | Revert commit on `main`; next push/PR uses restored config |
| Deploy | Render dashboard → previous deploy revision, or revert + redeploy |
| CodeQL / audit false positive | Temporarily adjust query/audit level in PR with documented reason |

## Operational Impact

- Blocking `npm audit` on PRs may delay merges until dependencies are patched.
- `backend-deploy` no longer triggers directly on push; it waits for CI success (adds ~5–15 min latency).
- Post-deploy smoke checks require repo variable `BACKEND_SMOKE_URL` (e.g. staging API base URL).

## Related

- [SECURITY.md](../../SECURITY.md)
- [CI/CD compliance](../compliance/cicd-wave5.md)
- [Observability runbook](./observability.md)
- [Ops deployment & rollback](./ops-deployment-rollback.md)
