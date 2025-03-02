import { Locale } from "@/i18n-config";
import DashboardLayout from "@/components/layout/dashboard-layout";
import LineChart from "@/components/shared/LineChart";
import StatsContainer from "@/components/shared/StatsContainer";
import { getDictionary } from "@/lib/i18n";
import PartnersChart from "@/components/shared/PartnersChart";
import SingleInputDateRangePicker from "@/components/shared/SingleInputDateRangePicker";
import { ArrowUpRight } from "lucide-react";

interface Props {
  params: {
    lang: Locale;
  };
}

export default async function HowItWorksPage({ params }: Props) {
  const translation = await getDictionary(params.lang);

  const data = [
    { date: "2024-01-01", value: 150 },
    { date: "2024-01-02", value: 142 },
    { date: "2024-01-03", value: 168 },
    { date: "2024-01-04", value: 189 },
    { date: "2024-01-05", value: 199 },
    { date: "2024-01-06", value: 187 },
    { date: "2024-01-07", value: 165 },
    { date: "2024-01-08", value: 178 },
    { date: "2024-01-09", value: 184 },
    { date: "2024-01-10", value: 201 },
    { date: "2024-01-11", value: 210 },
    { date: "2024-01-12", value: 196 },
    { date: "2024-01-13", value: 207 },
    { date: "2024-01-14", value: 198 },
    { date: "2024-01-15", value: 25 },
    { date: "2024-01-16", value: 219 },
    { date: "2024-01-17", value: 233 },
    { date: "2024-01-18", value: 228 },
    { date: "2024-01-19", value: 241 },
    { date: "2024-01-20", value: 2 },
    { date: "2024-01-21", value: 229 },
    { date: "2024-01-22", value: 243 },
    { date: "2024-01-23", value: 251 },
    { date: "2024-01-24", value: 264 },
    { date: "2024-01-25", value: 273 },
    { date: "2024-01-26", value: 29 },
    { date: "2024-01-10", value: 201 },
    { date: "2024-01-11", value: 210 },
    { date: "2024-01-12", value: 196 },
    { date: "2024-01-13", value: 207 },
    { date: "2024-01-14", value: 198 },
    { date: "2024-01-15", value: 25 },
    { date: "2024-01-16", value: 219 },
    { date: "2024-01-17", value: 233 },
    { date: "2024-01-18", value: 228 },
    { date: "2024-01-19", value: 241 },
    { date: "2024-01-20", value: 2 },
    { date: "2024-01-21", value: 229 },
    { date: "2024-01-22", value: 243 },
    { date: "2024-01-23", value: 251 },
    { date: "2024-01-24", value: 264 },
    { date: "2024-01-25", value: 273 },
    { date: "2024-01-26", value: 29 },
  ];

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



  return (
    <DashboardLayout lang={params.lang} translation={translation}>

      <div className="container mt-1">
        <StatsContainer translation={translation} />

      </div>
      <div className="flex justify-end items-center container">
        {/* <SingleInputDateRangePicker /> */}
      </div>


      <div className="pt-8">
        <div className="container flex flex-col md:flex-row gap-6">
          <div className="flex flex-col gap-5 w-full md:w-[32.334%]">
            <div className="bg-gradient-to-br from-white to-blue-50 shadow-lg p-6 rounded-xl border border-blue-100 h-[200px] transition-all hover:shadow-xl">
              <div className="flex items-center mb-3">
                <div className="h-8 w-1 bg-blue-500 rounded-full mr-3"></div>
                <h2 className="text-md font-bold text-gray-800">{translation.StatsContainer.Turnover}</h2>
              </div>
              <div className="flex items-end mt-6">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">22,200</span>
                <span className="ml-2 text-gray-500 font-medium">{translation.shared.currency}</span>
              </div>
              <div className="mt-3 flex items-center">
                <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-sm text-emerald-500">+4.6% from last month</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 shadow-lg p-6 rounded-xl border border-green-100 h-[200px] transition-all hover:shadow-xl">
              <div className="flex items-center mb-3">
                <div className="h-8 w-1 bg-green-500 rounded-full mr-3"></div>
                <h2 className="text-md font-bold text-gray-800">{translation.StatsContainer.Total_Sales}</h2>
              </div>
              <div className="flex items-end mt-6">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">11,200</span>
                <span className="ml-2 text-gray-500 font-medium">{translation.shared.currency}</span>
              </div>
              <div className="mt-3 flex items-center">
                <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-sm text-emerald-500">+2.8% from last month</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[65%]">

            <LineChart
              data={data}
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
            data={partnerData}
            metricTotal="Total Tickets"
            infoTooltipLabel="Number of tickets per partner"
          />     </div>
        <div className="">
          <PartnersChart
            label="Top 10 products par tickets"
            data={productData}
            metricTotal="Total Tickets"
            infoTooltipLabel="Number of tickets per products"
          />
        </div>

      </div>
    </DashboardLayout>
  );
}
