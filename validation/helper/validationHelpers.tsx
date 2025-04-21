import { z } from "zod";

export enum ValidationTypeEnum {
  STRING = "string",
  NUMBER = "number",
  ARRAY = "array",
}

/**
 * Validates a value against a Zod schema.
 * @param schema - The Zod schema to validate against.
 * @param value - The value to validate.
 * @returns An error message if validation fails, otherwise undefined.
 */
export const validateField = <T,>(
  schema: z.ZodSchema<T>,
  value: any,
  type: ValidationTypeEnum = ValidationTypeEnum.STRING
): string | undefined => {
  let parsedValue: any = value;

  // Convert numeric strings to numbers
  if (type === ValidationTypeEnum.NUMBER) {
    if (!isNaN(parsedValue as any) && !isNaN(parseFloat(parsedValue))) {
      parsedValue = parseFloat(parsedValue);
    }
  }

  const result = schema.safeParse(parsedValue);
  return result.success ? undefined : result.error.errors[0].message;
};
