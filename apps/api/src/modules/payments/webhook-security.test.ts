import test from "node:test";
import assert from "node:assert/strict";
import { PaymentWebhookDto } from "@repo/types";
import { assertWebhookSignature, computeWebhookSignature } from "./webhook-security";

const payload: PaymentWebhookDto = {
  event: "payment.success",
  transactionId: "txn-123",
  userId: "user-123",
  tier: "budget",
  amount: 10000,
  currency: "UGX"
};

test("accepts valid webhook signature and timestamp", () => {
  const now = new Date("2026-02-13T10:00:00Z");
  const timestamp = Math.floor(now.getTime() / 1000).toString();
  const signature = computeWebhookSignature("secret", timestamp, payload);

  assert.doesNotThrow(() =>
    assertWebhookSignature({
      secret: "secret",
      timestamp,
      signature,
      payload,
      now
    })
  );
});

test("rejects stale timestamps", () => {
  const now = new Date("2026-02-13T10:10:00Z");
  const timestamp = Math.floor(new Date("2026-02-13T09:59:00Z").getTime() / 1000).toString();
  const signature = computeWebhookSignature("secret", timestamp, payload);

  assert.throws(() =>
    assertWebhookSignature({
      secret: "secret",
      timestamp,
      signature,
      payload,
      now
    })
  );
});

test("rejects invalid signature", () => {
  const now = new Date("2026-02-13T10:00:00Z");
  const timestamp = Math.floor(now.getTime() / 1000).toString();

  assert.throws(() =>
    assertWebhookSignature({
      secret: "secret",
      timestamp,
      signature: "deadbeef",
      payload,
      now
    })
  );
});
