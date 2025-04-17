import { IEmployee } from "@/interfaces/IEmployee";

export interface EmployeeRow {
  id: number;
  matricule: string;
  first_name: string;
  last_name: string;
  full_name: string;
  national_id: string;
  address: string;
  city: string;
  date_of_engagement: string;
  cnss_number: string | null;
  birth_date: string | null;
}

const rowMapper = (employee: IEmployee[]): EmployeeRow[] => {
  return employee.map((employee) => ({
    id: employee.id,
    matricule: employee.matricule,
    first_name: employee.first_name,
    last_name: employee.last_name,
    full_name: employee.full_name,
    national_id: employee.national_id,
    address: employee.address,
    city: employee.city,
    date_of_engagement: employee.date_of_engagement,
    cnss_number: employee.cnss_number,
    birth_date: employee.birth_date,
  }));
};

const employeeMappers = {
  rowMapper,
};

export { employeeMappers };
