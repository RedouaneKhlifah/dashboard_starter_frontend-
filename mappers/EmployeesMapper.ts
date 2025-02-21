import { IEmployees } from "@/interfaces/IEmployee";

export interface UserRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
}

const rowMapper = (employee: IEmployees[]): UserRow[] => {
  return employee.map((employee) => ({
    id: employee.id,
    name: employee.full_name,
    email: employee.email,
    phone: employee.phone,
    country: employee.country,
    city: employee.city,
  }));
};

const employeeMappers = {
  rowMapper,
};

export default employeeMappers;
