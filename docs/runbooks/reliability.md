# Reliability Runbook

## Health Endpoints

### Liveness

GET /health/live

Used by orchestration systems to verify process health.

### Readiness

GET /health/ready

Checks:

- PostgreSQL
- Redis

### Startup

GET /health/startup

Checks startup completion and uptime.

---

## Rollback Procedure

1. Deploy previous image version.
2. Restart pods.
3. Verify /health/ready returns healthy.
4. Confirm database connectivity.

---

## Incident Response

If readiness fails:

- Check PostgreSQL availability
- Check Redis availability
- Inspect application logs
- Verify deployment secrets