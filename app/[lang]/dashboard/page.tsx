import { Locale } from "@/i18n-config";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { getDictionary } from "@/lib/i18n";
import httpServer from "@/lib/httpServer";
import Dashboard from "@/components/dashboard/dashboard";
import { InvoiceSummary } from "@/components/dashboard/types";

interface Props {
  params: {
    lang: Locale;
  };
}

const fetchDashboard = async (lang: Locale): Promise<InvoiceSummary> => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/dashboard/`;

  const res = await httpServer(url, {
    method: "GET",
    lang: lang,
  });

  if (!res.ok) {
    return {
      factures_partial: { total: 0, paid_amount: 0 },
      paid_amount_partial_complete: 0,
      ticket_net: { entry: "0", exit: "0" },
      profit: 0,
      revenue: 0,
      top_partenaires: [],
      top_products_by_quantity: [],
      facturesForChart: [],
    };
  }

  return await res.json();
};

export default async function DashboardPage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  const initialData = await fetchDashboard(params.lang);

  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <Dashboard
        initialData={initialData}
        translation={translation}
        lang={params.lang}
      />
    </DashboardLayout>
  );
}
