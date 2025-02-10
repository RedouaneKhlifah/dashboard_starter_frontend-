import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


export function createClientSchema(t: DictionaryType) {
  const { Ticket } = t;
  return z.string({
      required_error: Ticket.client_required,
  }).min(1, Ticket.client_required)
  .optional()
  // .refine(
  //     (client, ctx) => {
  //         if (ctx.parent?.status === 'EXIT' && !client) {
  //             return false;
  //         }
  //         return true;
  //     },
  //     {
  //         message: Ticket.clientRequiredForExit
  //     }
  // );
}