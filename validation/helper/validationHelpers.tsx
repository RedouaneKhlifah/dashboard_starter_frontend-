import { z } from "zod";

/**
 * Validates a value against a Zod schema.
 * @param schema - The Zod schema to validate against.
 * @param value - The value to validate.
 * @returns An error message if validation fails, otherwise undefined.
 */
export const validateField = <T,>(
  schema: z.ZodSchema<T>,
  value: string | number | boolean
): string | undefined => {
  let parsedValue: string | number | boolean = value;

  // Convert numeric strings to numbers
  if (typeof parsedValue === "string") {
    const trimmedValue = parsedValue.trim();
    // Check if the string is a numeric value
    if (!isNaN(trimmedValue as any) && !isNaN(parseFloat(trimmedValue))) {
      parsedValue = parseFloat(trimmedValue);
    }
  }

  const result = schema.safeParse(parsedValue);
  return result.success ? undefined : result.error.errors[0].message;
};
