import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { UsersTableProduct } from "@/components/product/TableProduct";
import { IProduct } from "@/interfaces/IProduct";
import http from "@/lib/http";
import httpServer from "@/lib/httpServer";

interface Props {
  params: {
    lang: Locale;
  };
}

const fetchProducts = async (lang: Locale) => {
  const response = await httpServer(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/products`,
    {
      method: "GET",
      lang: lang,
    }
  );

  return response;
};

export default async function ProductPage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  let records: IProduct[] = [];
  let totalRecords: number = 0;

  const res = await fetchProducts(params.lang);
  if (res.ok) {
    const response = await res.json();
    records = response.data;
    totalRecords = response.total as number;
  }

  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="p-6">
        <UsersTableProduct
          records={records}
          totalRecords={totalRecords}
          translation={translation}
          lang={params.lang}
        />
      </div>
    </DashboardLayout>
  );
}
