import { Router } from "express";
import { getValidationFailureCount } from "../middleware/validateResponse.js";

export const metricsRouter = Router();

const SERVICE_VERSION = process.env.npm_package_version ?? "unknown";

function formatPrometheusMetrics(): string {
  const mem = process.memoryUsage();
  const validationFailures = getValidationFailureCount();

  return [
    "# HELP splitnaira_validation_failures_total Total response schema validation failures.",
    "# TYPE splitnaira_validation_failures_total counter",
    `splitnaira_validation_failures_total ${validationFailures}`,
    "# HELP splitnaira_process_uptime_seconds Process uptime in seconds.",
    "# TYPE splitnaira_process_uptime_seconds gauge",
    `splitnaira_process_uptime_seconds ${process.uptime().toFixed(3)}`,
    "# HELP splitnaira_process_heap_bytes Resident heap size in bytes.",
    "# TYPE splitnaira_process_heap_bytes gauge",
    `splitnaira_process_heap_bytes ${mem.heapUsed}`,
    "# HELP splitnaira_info Service version info.",
    "# TYPE splitnaira_info gauge",
    `splitnaira_info{version="${SERVICE_VERSION}"} 1`,
  ].join("\n");
}

/**
 * Prometheus-compatible metrics endpoint.
 * Disabled unless METRICS_ENABLED=true (or unset in production with explicit opt-in).
 */
metricsRouter.get("/", (_req, res) => {
  res.setHeader("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
  res.send(`${formatPrometheusMetrics()}\n`);
});

export function isMetricsEnabled(): boolean {
  const flag = process.env.METRICS_ENABLED;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV === "production";
}
