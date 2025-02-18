import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createExpirationDateSchema(t: DictionaryType) {
  const { order } = t;
  return z
    .string({
      required_error: order.expiration_date_required,
    })
    .min(1, order.expiration_date_required);
}
