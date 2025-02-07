import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { UsersTablePartenaire } from "@/components/partenaire/UsersTablePartenaire";
import Header from "@/components/partenaire/Header";
import { IPartenaire } from "@/interfaces/IPartenaire";
import http from "@/lib/http";
import httpServer from "@/lib/httpServer";

interface Props {
  params: {
    lang: Locale;
  };
}

export default async function PartenairePage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  let partenaires: IPartenaire[] = [];
  const res = await fetchPartenaires(params.lang);

  if (res.ok) {
    partenaires = await res.json();
  }

  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="p-6">
        <Header translation={translation} lang={params.lang} />
        <UsersTablePartenaire
          partenaires={partenaires}
          translation={translation}
          lang={params.lang}
        />
      </div>
    </DashboardLayout>
  );
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