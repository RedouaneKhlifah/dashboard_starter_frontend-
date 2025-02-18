import { Status } from "@/dto/facture/factureForm";
import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


export function createStatusSchema(t: DictionaryType) {
  const { order } = t;
  return z.nativeEnum(Status, {
    required_error: order.status_required,
    invalid_type_error: order.status_invalid,
  });
}