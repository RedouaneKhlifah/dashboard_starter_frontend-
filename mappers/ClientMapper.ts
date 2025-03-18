import { IClient } from "@/interfaces/IClient";

export interface UserRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
}

const rowMapper = (client: IClient[]): UserRow[] => {
  return client.map((client) => ({
    id: client.id,
    name: client.company_ice,
    email: client.email,
    phone: client.phone,
    country: client.country,
    city: client.city,
  }));
};

const clientMappers = {
  rowMapper,
};

export default clientMappers;
