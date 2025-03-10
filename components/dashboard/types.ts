import { DataPoint } from "../shared/LineChart";

export interface FacturesPartial {
  total: number;
  paid_amount: number;
}

export interface PartenaireDashboardData {
  matricule: string;
  name: string;
  total_net: string;
}

export interface ProductDashboardData {
  name: string;
  total_quantity: number;
}

export interface InvoiceSummary {
  factures_partial: FacturesPartial;
  paid_amount_partial_complete: number;
  total_stock: number;
  profit: number;
  revenue: number;
  top_partenaires: PartenaireDashboardData[];
  top_products_by_quantity: ProductDashboardData[];
  facturesForChart: DataPoint[];
}
