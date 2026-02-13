import { createHmac, timingSafeEqual } from "node:crypto";
import { PaymentWebhookDto } from "@repo/types";

const MAX_SKEW_SECONDS = 300;

export class WebhookAuthError extends Error {}

export function buildWebhookSigningPayload(
  timestamp: string,
  payload: PaymentWebhookDto
): string {
  return [
    timestamp,
    payload.event,
    payload.transactionId,
    payload.userId,
    payload.tier,
    payload.amount.toString(),
    payload.currency
  ].join(".");
}

export function computeWebhookSignature(
  secret: string,
  timestamp: string,
  payload: PaymentWebhookDto
): string {
  const data = buildWebhookSigningPayload(timestamp, payload);
  return createHmac("sha256", secret).update(data).digest("hex");
}

export function assertWebhookSignature(options: {
  secret?: string;
  timestamp: string;
  signature: string;
  payload: PaymentWebhookDto;
  now?: Date;
}): void {
  const { secret, timestamp, signature, payload, now = new Date() } = options;
  if (!secret) {
    throw new WebhookAuthError("Webhook secret is not configured.");
  }

  const parsedTimestamp = Number(timestamp);
  if (!Number.isFinite(parsedTimestamp)) {
    throw new WebhookAuthError("Invalid webhook timestamp.");
  }

  const ageSeconds = Math.abs(now.getTime() - parsedTimestamp * 1000) / 1000;
  if (ageSeconds > MAX_SKEW_SECONDS) {
    throw new WebhookAuthError("Webhook timestamp is outside allowed skew.");
  }

  const expected = computeWebhookSignature(secret, timestamp, payload);
  if (!safeEqual(expected, signature)) {
    throw new WebhookAuthError("Invalid webhook signature.");
  }
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a, "utf8");
  const bBuffer = Buffer.from(b, "utf8");
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  return timingSafeEqual(aBuffer, bBuffer);
}
