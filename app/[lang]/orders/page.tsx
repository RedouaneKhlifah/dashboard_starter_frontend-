import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { TableOrder } from "@/components/order/TableOrder";
import httpServer from "@/lib/httpServer";
import { IOrder } from "@/interfaces/IOrder";

interface Props {
  params: {
    lang: Locale;
  };
}

const fetchorders = async (lang: Locale) => {
  const response = await httpServer(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/orders`,
    {
      method: "GET",
      lang: lang,
    }
  );

  return response;
};

export default async function ordersPage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  let records: IOrder[] = [];
  let totalRecords: number = 0;

  const res = await fetchorders(params.lang);
  if (res.ok) {
    const response = await res.json();
    records = response.data;
    totalRecords = response.total as number;
  }

  console.log("records", records[0].products);

  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="p-6">
        <TableOrder
          records={records}
          totalRecords={totalRecords}
          translation={translation}
          lang={params.lang}
        />
      </div>
    </DashboardLayout>
  );
}
