import { getStellarRpcServer, loadStellarConfig, executeWithRetry } from "./stellar.js";
import { getDataSource } from "./database.js";
import { TransactionRecord } from "../entities/Transaction.js";
import { logger } from "./logger.js";
import { scValToNative } from "@stellar/stellar-sdk";
import { fetchProjectById } from "./splits.service.js";
import { publishSseEvent } from "./SseEventBus.js";
import { getEventBus, TRANSACTION_CONFIRMED } from "./EventBus.js";

let pollInterval: NodeJS.Timeout | null = null;
let isPolling = false;
let startLedger: number | null = null;
let cursor: string | null = null;

export async function startEventListenerService() {
  if (pollInterval) {
    logger.warn("EventListenerService is already running");
    return;
  }

  logger.info("Starting EventListenerService background worker...");

  try {
    const server = getStellarRpcServer();
    const latestLedger = await executeWithRetry(() =>
      server.getLatestLedger()
    );

    // Start polling from 100 ledgers back to cover restart gaps
    startLedger = Math.max(1, latestLedger.sequence - 100);

    logger.info(
      `Initialized EventListenerService to start polling from ledger: ${startLedger}`
    );
  } catch (error) {
    logger.error(
      "Failed to fetch latest ledger on EventListenerService startup. Polling from latest.",
      { error }
    );
  }

  pollInterval = setInterval(() => {
    void pollEvents();
  }, 5000);
}

export function stopEventListenerService() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
    logger.info("EventListenerService background worker stopped cleanly.");
  }
}

export function getServiceHealth() {
  return {
    running: pollInterval !== null,
    isPolling,
    cursor,
  };
}

export async function pollEvents() {
  if (isPolling) return;

  isPolling = true;

  try {
    const config = loadStellarConfig();
    const server = getStellarRpcServer();
    const dataSource = getDataSource();
    const repo = dataSource.getRepository(TransactionRecord);

    const filters = [
      {
        type: "contract" as const,
        contractIds: [config.contractId],
      },
    ];

    const filterOptions: Parameters<typeof server.getEvents>[0] = cursor
      ? { filters, cursor, limit: 100 }
      : startLedger
      ? { filters, startLedger, limit: 100 }
      : { filters, cursor: "", limit: 100 };

    const response = await executeWithRetry(() =>
      server.getEvents(filterOptions)
    );

    if (response?.events?.length) {
      const records: TransactionRecord[] = [];

      for (const event of response.events) {
        try {
          const topics = event.topic.map((topic) => {
            try {
              return String(scValToNative(topic));
            } catch {
              return "";
            }
          });

          // Only `payment_sent` events are indexed as transaction records.
          if (topics[0] !== "payment_sent") {
            continue;
          }

          const projectId = topics[1] || "";
          const valueData = scValToNative(event.value) as [
            string,
            string | number | bigint
          ];
          const recipient = valueData[0];
          const amount = String(valueData[1]);
          const txHash = event.txHash;
          const timestamp = Math.floor(
            new Date(event.ledgerClosedAt).getTime() / 1000
          );

          // Skip already-indexed transactions. The DB also enforces uniqueness
          // on txHash, but this avoids redundant work during polling.
          const existing = await repo.findOneBy({ txHash });
          if (existing) {
            continue;
          }

          // Resolve the project's token address; fall back to "Native".
          let token = "Native";
          try {
            const project = await fetchProjectById(projectId);
            if (project && typeof project === "object" && "token" in project) {
              token = String(project.token);
            }
          } catch (err) {
            logger.warn(
              `Could not resolve token address for project ${projectId}. Using fallback.`,
              { err }
            );
          }

          records.push(
            repo.create({
              roundId: projectId,
              recipient,
              amount,
              token,
              timestamp,
              txHash,
              status: "completed",
            })
          );
        } catch (eventError) {
          logger.error("Error processing polled Soroban event", {
            event,
            error: eventError,
          });
        }
      }

      if (records.length > 0) {
        await repo.upsert(records, {
          conflictPaths: ["txHash"],
          skipUpdateIfNoValuesChanged: true,
        });

        logger.info(
          `Upserted ${records.length} transaction record(s) from current event batch.`
        );

        // Real-time push: notify the generic event bus (Issue #618) and the
        // txHash-keyed SSE bus so connected clients are updated immediately.
        for (const record of records) {
          getEventBus().emit(TRANSACTION_CONFIRMED, record);
          publishSseEvent(record.txHash, {
            txHash: record.txHash,
            roundId: record.roundId,
            recipient: record.recipient,
            amount: record.amount,
            token: record.token,
            timestamp: record.timestamp,
            status: record.status,
          });
        }
      }

      if (response.cursor) {
        cursor = response.cursor;
      }
    }
  } catch (error) {
    logger.error("Error occurred in background Soroban event poll", {
      error,
    });
  } finally {
    isPolling = false;
  }
}