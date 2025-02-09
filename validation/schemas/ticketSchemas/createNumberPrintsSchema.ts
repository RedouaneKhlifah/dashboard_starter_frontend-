import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


export function createNumberPrintsSchema(t: DictionaryType) {
    const { Ticket } = t;
    return z.number({
        required_error: Ticket.number_prints_required,
        invalid_type_error: Ticket.invalid_number_prints
    }).min(1, Ticket.number_prints_required);
}