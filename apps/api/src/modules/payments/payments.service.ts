import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PaymentWebhookDto } from "@repo/types";
import { prisma } from "@repo/database";
import { PaidTier } from "../subscriptions/plan-catalog";
import { SubscriptionsService } from "../subscriptions/subscriptions.service";
import { buildReplayWebhookResponse } from "./payment-replay";
import { assertWebhookSignature, WebhookAuthError } from "./webhook-security";

interface PaymentEventRow {
  transaction_id: string;
  status: string;
  subscription_end_date: Date | null;
}

const db = prisma as {
  $queryRawUnsafe<T = unknown>(query: string, ...values: unknown[]): Promise<T>;
  $executeRawUnsafe(query: string, ...values: unknown[]): Promise<number>;
};

@Injectable()
export class PaymentsService {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  async handleWebhook(
    payload: PaymentWebhookDto,
    security: { signature: string; timestamp: string }
  ) {
    try {
      assertWebhookSignature({
        secret: process.env.MTN_WEBHOOK_SECRET,
        timestamp: security.timestamp,
        signature: security.signature,
        payload
      });
    } catch (error) {
      if (error instanceof WebhookAuthError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }

    const inserted = await db.$queryRawUnsafe<PaymentEventRow[]>(
      `
      INSERT INTO payment_webhook_events (
        transaction_id,
        event,
        user_id,
        tier,
        amount,
        currency,
        payload,
        status,
        processed_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, 'received', NOW())
      ON CONFLICT (transaction_id) DO NOTHING
      RETURNING transaction_id, status, subscription_end_date
      `,
      payload.transactionId,
      payload.event,
      payload.userId,
      payload.tier,
      payload.amount,
      payload.currency,
      JSON.stringify(payload)
    );

    if (inserted.length === 0) {
      const existing = await db.$queryRawUnsafe<PaymentEventRow[]>(
        `
        SELECT transaction_id, status, subscription_end_date
        FROM payment_webhook_events
        WHERE transaction_id = $1
        LIMIT 1
        `,
        payload.transactionId
      );
      return buildReplayWebhookResponse(payload.transactionId, {
        status: existing[0]?.status,
        subscriptionEndDate: existing[0]?.subscription_end_date
      });
    }

    if (payload.event !== "payment.success") {
      await db.$executeRawUnsafe(
        `
        UPDATE payment_webhook_events
        SET status = 'failed'
        WHERE transaction_id = $1
        `,
        payload.transactionId
      );
      return {
        processed: true,
        activated: false,
        transactionId: payload.transactionId
      };
    }

    try {
      const subscription = await this.subscriptionsService.activatePlan(
        payload.userId,
        payload.tier as PaidTier
      );

      await db.$executeRawUnsafe(
        `
        UPDATE payment_webhook_events
        SET status = 'applied',
            subscription_end_date = $2
        WHERE transaction_id = $1
        `,
        payload.transactionId,
        subscription.endDate
      );

      return {
        processed: true,
        activated: true,
        transactionId: payload.transactionId,
        subscription
      };
    } catch (error) {
      await db.$executeRawUnsafe(
        `
        UPDATE payment_webhook_events
        SET status = 'error'
        WHERE transaction_id = $1
        `,
        payload.transactionId
      );
      throw error;
    }
  }
}
