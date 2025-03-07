"use client";

import { Locale } from "@/i18n-config";
import { useEffect, useState } from "react";
import { InvoiceSummary } from "./types";
import { DictionaryType } from "@/lib/i18n";
import httpServer from "@/lib/httpServer";
import LineChart from "@/components/shared/LineChart";
import StatsContainer from "@/components/shared/StatsContainer";
import PartnersChart from "@/components/shared/PartnersChart";
import { LayoutDashboard } from "lucide-react";
import ProductsChart from "@/components/shared/ProductsChart";
import SingleInputDateRangePicker from "../shared/SingleInputDateRangePicker";
import http from "@/lib/http";

interface DashboardProps {
  initialData: InvoiceSummary;
  translation: DictionaryType;
  lang: Locale;
}

const Dashboard = ({ initialData, translation, lang }: DashboardProps) => {
  const datas = [{ date: "2024-01-01", value: 150 }];
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: lastMonth,
    end: today,
  });

  const [data, setData] = useState<InvoiceSummary>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!dateRange.start || !dateRange.end) return;

      setLoading(true);
      try {
        const startDate = dateRange.start.toISOString().split("T")[0];
        const endDate = dateRange.end.toISOString().split("T")[0];

        const res = await http(
          `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/dashboard/${startDate}/${endDate}`,
          {
            method: "GET",
          }
        );

        if (res.ok) {
          const newData = await res.json();
          setData(newData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateRange, lang]);

  return (
    <>
      <div className="flex justify-between items-center container">
        <div className="flex gap-1">
          <LayoutDashboard className="w-6 h-6 mx-2 text-foreground" />
          <h2 className="text-2xl text-foreground font-bold">
            {translation.sidebar.dashboard.dashboard_link}
          </h2>
        </div>
        <div className="w-[24%]">
          <SingleInputDateRangePicker
            value={dateRange}
            onChange={setDateRange}
            translation={translation}
          />
        </div>
      </div>
      <div className="container mt-1">
        {loading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : (
          <StatsContainer translation={translation} data={data} />
        )}
      </div>
      <div className="pt-8">
        <div className="container flex flex-col md:flex-row gap-6">
          <div className="flex flex-col gap-5 w-full md:w-[32.334%]">
            <div className="bg-gradient-to-br from-white to-blue-50 shadow-lg p-6 rounded-xl border border-blue-100 h-[200px] transition-all hover:shadow-xl">
              <div className="flex items-center mb-3">
                <div
                  className={`h-8 w-1 bg-blue-500 rounded-full ${
                    lang === "ar" ? "ml-3" : "mr-3"
                  }`}
                ></div>
                <h2 className="text-md font-bold text-gray-800">
                  {translation.StatsContainer.Turnover}
                </h2>
              </div>
              <div className="flex items-end mt-6">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  {data.paid_amount_partial_complete?.toFixed(2) ?? "0.00"}
                </span>
                <span className="mx-1 text-gray-500 font-medium">
                  {translation.shared.currency}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 shadow-lg p-6 rounded-xl border border-green-100 h-[200px] transition-all hover:shadow-xl">
              <div className="flex items-center mb-3">
                <div
                  className={`h-8 w-1 bg-green-500 rounded-full ${
                    lang === "ar" ? "ml-3" : "mr-3"
                  }`}
                ></div>
                <h2 className="text-md font-bold text-gray-800">
                  {translation.StatsContainer.Total_Sales}
                </h2>
              </div>
              <div className="flex items-end mt-6">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
                  {data.profit?.toFixed(2) ?? "0.00"}
                </span>
                <span className="mx-1 text-gray-500 font-medium">
                  {translation.shared.currency}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[65%]">
            <LineChart
              data={datas}
              label={translation.sidebar.dashboard.charts.sales.label}
              infoTooltipLabel={
                translation.sidebar.dashboard.charts.sales.infoTooltipLabel
              }
              metricTotal={
                translation.sidebar.dashboard.charts.sales.metricTotal
              }
            />
          </div>
        </div>
      </div>
      <div className="container space-y-4 pt-4 mb-4">
        <PartnersChart
          label={translation.sidebar.dashboard.charts.partners.label}
          data={data.top_partenaires}
          metricTotal={
            translation.sidebar.dashboard.charts.partners.metricTotal
          }
          infoTooltipLabel={
            translation.sidebar.dashboard.charts.partners.infoTooltipLabel
          }
        />
        <ProductsChart
          label={translation.sidebar.dashboard.charts.products.label}
          data={data.top_products_by_quantity}
          metricTotal={
            translation.sidebar.dashboard.charts.products.metricTotal
          }
          infoTooltipLabel={
            translation.sidebar.dashboard.charts.products.infoTooltipLabel
          }
        />
      </div>
    </>
  );
};

export default Dashboard;
