export interface IEmployee {
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
