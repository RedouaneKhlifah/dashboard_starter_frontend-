import { ICreateorders } from "@/dto/order/createOrder";
import { IOrderForm } from "@/dto/order/orderForm";

// Mapper function to format ICreateorders data into the required structure
const ordersDataMapper = (data: IOrderForm): ICreateorders => {
  return {
    reference: data.reference,
    order_date: data.orders_date,
    expiration_date: data.expiration_date,
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
