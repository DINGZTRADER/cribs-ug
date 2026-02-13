import { z } from "zod";

export const paymentWebhookSchema = z.object({
  event: z.enum(["payment.success", "payment.failed"]),
  transactionId: z.string().min(1),
  userId: z.string().min(1),
  tier: z.enum(["budget", "family", "premium"]),
  amount: z.number().int().positive(),
  currency: z.string().min(3).max(8)
});

export const webhookHeadersSchema = z.object({
  signature: z.string().min(1),
  timestamp: z.string().min(1)
});
