import { ICreateDevis } from "@/dto/devis/createDevis";
import { IOrderForm } from "@/dto/order/orderForm";

// Mapper function to format ICreateDevis data into the required structure
const DevisDataMapper = (data: IOrderForm): ICreateDevis => {
  return {
    reference: data.reference,
    devis_date: data.devis_date,
    expiration_date: data.expiration_date,
    client_id: data?.client?.id,
    products: data.products,
    note: data.note,
    tva: data.tva,
    remise_type: data.remise_type,
    remise: data.remise,
  };
};

const DevisMapper = {
  DevisDataMapper,
};

export { DevisMapper };
