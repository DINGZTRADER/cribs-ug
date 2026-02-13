import test from "node:test";
import assert from "node:assert/strict";
import { buildReplayWebhookResponse } from "./payment-replay";

test("returns deterministic replay response for duplicate transaction", () => {
  const endDate = new Date("2026-02-20T12:00:00Z");
  const response = buildReplayWebhookResponse("txn-abc", {
    status: "applied",
    subscriptionEndDate: endDate
  });

  assert.deepEqual(response, {
    processed: true,
    replay: true,
    transactionId: "txn-abc",
    status: "applied",
    subscriptionEndDate: "2026-02-20T12:00:00.000Z"
  });
});
