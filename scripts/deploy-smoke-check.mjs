#!/usr/bin/env node
/**
 * Post-deploy smoke check — polls /health/ready until success or timeout.
 *
 * Usage:
 *   BACKEND_URL=https://api.example.com node scripts/deploy-smoke-check.mjs
 *
 * Env:
 *   BACKEND_URL       Base URL (default http://localhost:3001)
 *   SMOKE_TIMEOUT_MS  Max wait (default 300000 = 5 min)
 *   SMOKE_INTERVAL_MS Poll interval (default 10000)
 */
const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:3001").replace(/\/$/, "");
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS ?? 300_000);
const INTERVAL_MS = Number(process.env.SMOKE_INTERVAL_MS ?? 10_000);

async function checkReady() {
  const res = await fetch(`${BACKEND_URL}/health/ready`, {
    signal: AbortSignal.timeout(15_000),
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const deadline = Date.now() + TIMEOUT_MS;
  let attempt = 0;

  console.log(`Smoke check: ${BACKEND_URL}/health/ready (timeout ${TIMEOUT_MS}ms)`);

  while (Date.now() < deadline) {
    attempt += 1;
    try {
      const result = await checkReady();
      if (result.ok && result.body?.status === "ready") {
        console.log(`Ready after ${attempt} attempt(s).`);
        process.exit(0);
      }
      console.log(
        `Attempt ${attempt}: not ready (HTTP ${result.status}, status=${result.body?.status ?? "unknown"})`,
      );
    } catch (err) {
      console.log(`Attempt ${attempt}: ${err instanceof Error ? err.message : String(err)}`);
    }
    if (Date.now() + INTERVAL_MS < deadline) {
      await sleep(INTERVAL_MS);
    }
  }

  console.error(`Smoke check failed: /health/ready did not become ready within ${TIMEOUT_MS}ms`);
  process.exit(1);
}

main();
