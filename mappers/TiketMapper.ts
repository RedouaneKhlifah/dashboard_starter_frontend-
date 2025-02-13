import { ITicketForm } from "@/dto/ticket/ticketForm";
import { ITicket } from "@/interfaces/ITicket";

const updateTicketMapper = (ticket: ITicket): ITicketForm => {
  return {
    id: ticket.id,
    partenaire: {
      id: ticket.partenaire.id,
      title: ticket.partenaire.matricule,
    },
    product: {
      id: ticket.product.id,
      title: ticket.product.name,
    },
    client:
      (ticket.client && {
        id: ticket.client.id,
        title: ticket.client.full_name,
      }) ||
      null,
    number_prints: ticket.number_prints,
    poids_brut: ticket.poids_brut,
    poids_tare: ticket.poids_tare,
    status: ticket.status,
  };
};

export default updateTicketMapper;
