import { ICreateorders } from "@/dto/order/createOrder";
import { IOrderForm } from "@/dto/order/orderForm";

export interface OrderRow {
  id: number;

  ticket_id: number | null;

  client_id: number;

  reference: string;

  order_date: string;

  expiration_date: string;

  tva: number;

  remise_type: "PERCENT" | "FIXED";

  remise: number;

  note: string;

  total: number;

  subtotal: number;
}

// Mapper function to format ICreateorders data into the required structure
const ordersDataMapper = (data: IOrderForm): ICreateorders => {
  return {
    reference: data.reference,
    order_date: data.order_date,
    expiration_date: data.expiration_date,
    bcn: data.bcn,
    client_id: data?.client?.id,
    products: data.products,
    note: data.note,
    tva: data.tva,
    remise_type: data.remise_type,
    remise: data.remise,
  };
};

const ordersMapper = {
  ordersDataMapper,
};

export { ordersMapper };
