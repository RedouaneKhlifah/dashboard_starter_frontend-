import { Locale } from "@/i18n-config";
import DashboardLayout from "@/components/layout/dashboard-layout";
import LineChart from "@/components/shared/LineChart";
import StatsContainer from "@/components/shared/StatsContainer";
import { getDictionary } from "@/lib/i18n";
import PartnersChart from "@/components/shared/PartnersChart";
import SingleInputDateRangePicker from "@/components/shared/SingleInputDateRangePicker";
import { ArrowUpRight, Gem, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import RangePicker from "@/components/shared/RangePicker";
import httpServer from "@/lib/httpServer";
import ProductsChart from "@/components/shared/ProductsChart";

interface Props {
  params: {
    lang: Locale;
  };
}

const fetchDashboard = async (lang: Locale) => {
  return await httpServer(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/dashboard`,
    {
      method: "GET",
      lang: lang,
    }
  );
};

interface FacturesPartial {
  total: number;
  paid_amount: number;
}

interface TicketNet {
  entry: string;
  exit: string;
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
  ticket_net: TicketNet;
  profit: number;
  revenue: number;
  top_partenaires: PartenaireDashboardData[];
  top_products_by_quantity: ProductDashboardData[];
}

export default async function HowItWorksPage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  let data: InvoiceSummary = {
    factures_partial: { total: 0, paid_amount: 0 },
    paid_amount_partial_complete: 0,
    ticket_net: { entry: "0", exit: "0" },
    profit: 0,
    revenue: 0,
    top_partenaires: [],
    top_products_by_quantity: [],
  };

  const datas = [{ date: "2024-01-01", value: 150 }];

  const partnerData = [
    { name: "Partner A", value: 352 },
    { name: "Partner B", value: 298 },
    { name: "Partner C", value: 273 },
    { name: "Partner D", value: 245 },
    { name: "Partner E", value: 217 },
    { name: "Partner F", value: 186 },
    { name: "Partner G", value: 165 },
    { name: "Partner H", value: 143 },
    { name: "Partner I", value: 127 },
    { name: "Partner J", value: 98 },
  ];

  const productData = [
    { name: "Product A", value: 152 },
    { name: "Product B", value: 198 },
    { name: "Product C", value: 273 },
    { name: "Product D", value: 245 },
    { name: "Product E", value: 117 },
    { name: "Product F", value: 186 },
    { name: "Product G", value: 165 },
    { name: "Product H", value: 143 },
    { name: "Product I", value: 27 },
    { name: "Product J", value: 98 },
  ];

  const res = await fetchDashboard(params.lang);
  if (res.ok) {
    const response = await res.json();
    data = response;
  }

  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="flex justify-between items-center container">
        <div className="flex gap-1">
          <LayoutDashboard className="w-6 h-6 mx-2 text-foreground" />
          <h2 className="text-2xl text-foreground font-bold">
            {translation.sidebar.dashboard.dashboard_link}
          </h2>
        </div>
        <RangePicker translation={translation} />
      </div>
      <div className="container mt-1">
        <StatsContainer translation={translation} data={data} />
      </div>
      <div className="pt-8">
        <div className="container flex flex-col md:flex-row gap-6">
          <div className="flex flex-col gap-5 w-full md:w-[32.334%]">
            <div className="bg-gradient-to-br from-white to-blue-50 shadow-lg p-6 rounded-xl border border-blue-100 h-[200px] transition-all hover:shadow-xl">
              <div className="flex items-center mb-3">
                <div className="h-8 w-1 bg-blue-500 rounded-full mr-3"></div>
                <h2 className="text-md font-bold text-gray-800">
                  {translation.StatsContainer.Turnover}
                </h2>
              </div>
              <div className="flex items-end mt-6">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {data.paid_amount_partial_complete?.toFixed(2) ?? "0.00"}
                </span>
                <span className="ml-2 text-gray-500 font-medium">
                  {translation.shared.currency}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 shadow-lg p-6 rounded-xl border border-green-100 h-[200px] transition-all hover:shadow-xl">
              <div className="flex items-center mb-3">
                <div className="h-8 w-1 bg-green-500 rounded-full mr-3"></div>
                <h2 className="text-md font-bold text-gray-800">
                  {translation.StatsContainer.Total_Sales}
                </h2>
              </div>
              <div className="flex items-end mt-6">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
                  {data.profit?.toFixed(2) ?? "0.00"}
                </span>
                <span className="ml-2 text-gray-500 font-medium">
                  {translation.shared.currency}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[65%]">
            <LineChart
              data={datas}
              label="Sales Over Time"
              infoTooltipLabel="Shows daily sales trends"
              metricTotal="$1,234"
            />
          </div>
        </div>
      </div>
      <div className="container space-y-4 pt-4 mb-4">
        <div className="">
          <PartnersChart
            label="Top 10 partenaires par tickets"
            data={data.top_partenaires}
            metricTotal="Total Tickets"
            infoTooltipLabel="Number of tickets per partner"
          />
        </div>
        <div className="">
          <ProductsChart
            label="Top 10 products par tickets"
            data={data.top_products_by_quantity}
            metricTotal="Total Tickets"
            infoTooltipLabel="Number of tickets per products"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
