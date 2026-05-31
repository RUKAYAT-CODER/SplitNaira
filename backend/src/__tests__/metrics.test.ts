import { describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";
import { metricsRouter } from "../routes/metrics.js";
import { resetValidationFailureCount } from "../middleware/validateResponse.js";

describe("GET /metrics", () => {
  const app = express();
  app.use("/metrics", metricsRouter);

  it("returns Prometheus text exposition", async () => {
    resetValidationFailureCount();
    const res = await request(app).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/plain/);
    expect(res.text).toContain("splitnaira_validation_failures_total 0");
    expect(res.text).toContain("splitnaira_process_uptime_seconds");
  });
});
