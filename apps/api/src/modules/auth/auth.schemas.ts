import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional(),
  password: z.string().min(8),
  role: z.enum(["tenant", "landlord"]).default("tenant")
});

export const loginSchema = z.object({
  phone: z.string().min(7),
  password: z.string().min(8)
});
