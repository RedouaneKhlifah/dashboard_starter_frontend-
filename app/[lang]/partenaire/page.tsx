import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { UsersTablePartenaire } from "@/components/partenaire/UsersTablePartenaire";
import { IPartenaire } from "@/interfaces/IPartenaire";
import http from "@/lib/http";
import httpServer from "@/lib/httpServer";

interface Props {
  params: {
    lang: Locale;
  };
}

const fetchPartenaires = async (lang: Locale) => {
  const response = await httpServer(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/partenaires`,
    {
      method: "GET",
      lang: lang,
    }
  );

  return response;
};

export default async function PartenairePage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  let records: IPartenaire[] = [];
  let totalRecords: number = 0;

  const res = await fetchPartenaires(params.lang);
  if (res.ok) {
    const response = await res.json();
    records = response.data;
    totalRecords = response.total as number;
  }


  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="p-6">
        <UsersTablePartenaire
          records={records}
          totalRecords={totalRecords}
          translation={translation}
          lang={params.lang}
        />
      </div>
    </DashboardLayout>
  );
}

