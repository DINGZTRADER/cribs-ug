import { BadRequestException } from "@nestjs/common";
import { z } from "zod";

export function validateOrThrow<T>(
  schema: z.ZodType<T>,
  input: unknown,
  message: string
): T {
  const result = schema.safeParse(input);
  if (result.success) {
    return result.data;
  }

  throw new BadRequestException({
    code: "VALIDATION_ERROR",
    message,
    issues: result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message
    }))
  });
}
