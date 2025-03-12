export interface IEmployeesForm {
  id?: number;
  matricule: string;
  first_name: string;
  last_name: string;
  national_id: string;
  address: string;
  city: string;
  date_of_engagement: string;
  price_per_ton: number;
  cnss_number: string | null;
  birth_date: string | null;
}
