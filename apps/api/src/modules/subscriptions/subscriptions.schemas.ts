import { z } from "zod";

export const activateSubscriptionSchema = z.object({
  tier: z.enum(["budget", "family", "premium"])
});

export const featureQuerySchema = z.object({
  feature: z.enum(["contact_reveal", "priority_matches", "guided_visits"])
});

export const unlockPropertyParamsSchema = z.object({
  propertyId: z.string().min(1)
});
