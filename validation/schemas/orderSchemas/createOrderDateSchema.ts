import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createOrderDateSchema(t: DictionaryType) {
  const { order } = t;
  return z
    .string({
      required_error: order.orders_date_required,
    })
    .min(1, order.orders_date_required);
}
