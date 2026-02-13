export interface PaymentEventSnapshot {
  status?: string;
  subscriptionEndDate?: Date | null;
}

export function buildReplayWebhookResponse(
  transactionId: string,
  snapshot?: PaymentEventSnapshot
) {
  return {
    processed: true,
    replay: true,
    transactionId,
    status: snapshot?.status ?? "unknown",
    subscriptionEndDate: snapshot?.subscriptionEndDate?.toISOString() ?? null
  };
}
