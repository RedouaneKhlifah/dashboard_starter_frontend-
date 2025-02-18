import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createOrderDateSchema(t: DictionaryType) {
  const { order } = t;
  return z
    .string({
      required_error: order.order_date_required,
    })
    .min(1, order.order_date_required);
}
