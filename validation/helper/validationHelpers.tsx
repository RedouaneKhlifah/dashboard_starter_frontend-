import { z } from "zod";

/**
 * Validates a value against a Zod schema.
 * @param schema - The Zod schema to validate against.
 * @param value - The value to validate.
 * @returns An error message if validation fails, otherwise undefined.
 */
export const validateField = <T,>(
  schema: z.ZodSchema<T>,
  value: string
): string | undefined => {
  const result = schema.safeParse(value);
  return result.success ? undefined : result.error.errors[0].message;
};
