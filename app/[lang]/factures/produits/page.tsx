import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { TableFacture } from "@/components/facture/TableFacture";
import { IFacture } from "@/interfaces/IFacture";
import httpServer from "@/lib/httpServer";

interface Props {
  params: {
    lang: Locale;
  };
}

const fetchFactures = async (lang: Locale) => {
  const response = await httpServer(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/factures`,
    {
      method: "GET",
      lang: lang,
    }
  );

  return response;
};

export default async function FacturePage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  let records: IFacture[] = [];
  let totalRecords: number = 0;

  const res = await fetchFactures(params.lang);
  if (res.ok) {
    const response = await res.json();
    records = response.data;
    totalRecords = response.total as number;
  }

  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="p-6">
        <TableFacture
          records={records}
          totalRecords={totalRecords}
          translation={translation}
          lang={params.lang}
        />
      </div>
    </DashboardLayout>
  );
}
