# Observability Runbook

## Metrics

GET /metrics

Prometheus-compatible metrics endpoint.

## Correlation IDs

Every request receives:

X-Correlation-Id

Used for tracing requests across services.

## Structured Logs

Logs are emitted as JSON.

Fields:

- level
- timestamp
- correlationId
- path
- method
- durationMs

## Incident Investigation

1. Locate correlation ID.
2. Search logs.
3. Trace request lifecycle.
4. Review metrics around failure window.