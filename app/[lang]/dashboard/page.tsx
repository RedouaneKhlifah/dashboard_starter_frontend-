import { Locale } from "@/i18n-config";
import DashboardLayout from "@/components/layout/dashboard-layout";
import LineChart from "@/components/shared/LineChart";
import { getDictionary } from "@/lib/i18n";

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
  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="flex gap-4">
        <LineChart
          data={data}
          label="Sales Over Time"
          infoTooltipLabel="Shows daily sales trends"
          metricTotal="$1,234"
        />
        <div className="w-1/3">
          <LineChart
            data={data}
            label="Sales Over Time"
            infoTooltipLabel="Shows daily sales trends"
            metricTotal="$1,234"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
