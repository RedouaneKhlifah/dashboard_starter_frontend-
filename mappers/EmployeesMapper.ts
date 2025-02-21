import { IEmployee } from "@/interfaces/IEmployee";

export interface UserRow {
  id: number;
  employee_id: string;
  name: string;
  city: string;
  address: string;
  date_of_engagement: string;
  monthly_salary: number;
  national_id: string;
  price_per_day: number;
  price_per_hour: number;
}

const rowMapper = (employee: IEmployee[]): UserRow[] => {
  return employee.map((employee) => ({
    id: employee.id,
    employee_id: employee.employee_id,
    name: employee.full_name,
    address: employee.address,
    date_of_engagement: employee.date_of_engagement,
    monthly_salary: employee.monthly_salary,
    national_id: employee.national_id,
    price_per_day: employee.price_per_day,
    price_per_hour: employee.price_per_hour,
    city: employee.city,
  }));
};

const employeeMappers = {
  rowMapper,
};

export default employeeMappers;
