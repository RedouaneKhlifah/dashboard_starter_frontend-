import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { TableOrder } from "@/components/order/TableOrder";
import { IDevis } from "@/interfaces/IDevis";
import http from "@/lib/http";
import httpServer from "@/lib/httpServer";

interface Props {
  params: {
    lang: Locale;
  };
}

const fetchOrders = async (lang: Locale) => {
  const response = await httpServer(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/orders`,
    {
      method: "GET",
      lang: lang,
    }
  );

  return response;
};

export default async function DevisPage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  let records: IDevis[] = [];
  let totalRecords: number = 0;

  const res = await fetchOrders(params.lang);
  if (res.ok) {
    const response = await res.json();
    records = response.data;
    totalRecords = response.total as number;
  }

  const fakeDevis: IDevis[] = [
    {
      id: 1,
      refrence: "DEV-2023-001",
      devis_date: "2023-10-01",
      expiration_date: "2023-11-01",
      clien: "Acme Corporation",
      total: 2450.75,
      status: "pending",
      articles: [
        {
          name: "Web Development", quantity: 1, sellingPrice: 2000,
          id: 0,
          costPrice: 0,
          selected: false
        },
        {
          name: "Consulting", quantity: 5, sellingPrice: 90.15,
          id: 0,
          costPrice: 0,
          selected: false
        }
      ]
    },
    {
      id: 2,
      refrence: "DEV-2023-002",
      devis_date: "2023-10-05",
      expiration_date: "2023-11-05",
      clien: "Globex Inc.",
      total: 1800.0,
      status: "approved",
      articles: [
        {
          name: "Mobile App Development", quantity: 1, sellingPrice: 1500,
          id: 0,
          costPrice: 0,
          selected: false
        },
        {
          name: "Maintenance", quantity: 3, sellingPrice: 100,
          id: 0,
          costPrice: 0,
          selected: false
        }
      ]
    },

  ];

  const fakeResponse = {
    ok: true,
    data: fakeDevis,
    total: fakeDevis.length
  };

  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="p-6">
        <TableOrder
          records={fakeResponse.data}
          totalRecords={fakeResponse.total}
          translation={translation}
          lang={params.lang}
        />
      </div>
    </DashboardLayout>
  );
}
