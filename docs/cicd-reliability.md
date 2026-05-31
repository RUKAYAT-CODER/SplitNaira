## CI/CD Reliability Improvements (Wave 5)

### Changes
- Added `.github/workflows/dependency-audit.yml`: weekly automated `npm audit` for high-severity vulnerabilities (blocking)
- Added `scripts/healthcheck.mjs`: sidecar deployment readiness probe for `/health/live`
- Added `scripts/deploy-smoke-check.mjs`: post-deploy poll of `/health/ready` (used in deploy workflows when `BACKEND_SMOKE_URL` is set)
- Backend deploy waits for CI success via `workflow_run` before triggering Render

### Rollback
- Delete `.github/workflows/dependency-audit.yml` to stop scheduled audits
- Remove smoke-check steps from `backend-deploy.yml` / `mainnet-deploy.yml`
- Restore push trigger on `backend-deploy.yml` to deploy without CI gate

### Operational Notes
- Audit workflow runs every Monday at 06:00 UTC and can be triggered manually
- Set repository variable `BACKEND_SMOKE_URL` (e.g. `https://api-staging.example.com`) to enable post-deploy verification
- Healthcheck script exits with 503 if backend is unreachable — safe to use as a pre-deploy gate