import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  MTN_API_KEY: z.string().min(1).optional(),
  MTN_WEBHOOK_SECRET: z.string().min(1).optional(),
  DEV_SEED_KEY: z.string().min(8).optional(),
  ENABLE_DEV_ENDPOINTS: z.enum(["0", "1"]).optional(),
  SUPABASE_URL: z.string().url().optional()
});

export type Env = z.infer<typeof envSchema>;
