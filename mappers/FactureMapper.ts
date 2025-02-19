import { ICreateInvoice } from "@/dto/invoice/createInvoices";
import { IFactureForm } from "@/dto/facture/factureForm";

// Mapper function to format ICreateDevis data into the required structure
const FactureDataMapper = (data: IFactureForm): ICreateInvoice => {
  return {
    reference: data.reference,
    facture_date: data.facture_date,
    expiration_date: data.expiration_date,
    client_id: data?.client?.id,
    products: data.products,
    note: data.note,
    tva: data.tva,
    remise_type: data.remise_type,
    remise: data.remise,
    paid_amount: data.paid_amount,
  };
};

const FactureMapper = {
  FactureDataMapper,
};

export { FactureMapper };
