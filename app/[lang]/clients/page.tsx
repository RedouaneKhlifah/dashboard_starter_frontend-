import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { UsersTableClient } from "@/components/client/UsersTableClient";
import Header from "@/components/client/Header";
import { IClient } from "@/interfaces/IClient";
import http from "@/lib/http";
import httpServer from "@/lib/httpServer";

interface Props {
  params: {
    lang: Locale;
  };
}

export default async function UsersPage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  let users: IClient[] = [];
  const res = await fetchClients(params.lang);

  if (res.ok) {
    users = await res.json();
  }

  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="p-6">
        <Header translation={translation} lang={params.lang} />
        <UsersTableClient
          users={users}
          translation={translation}
          lang={params.lang}
        />
      </div>
    </DashboardLayout>
  );
}

const fetchClients = async (lang: Locale) => {
  const response = await httpServer(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients`,
    {
      method: "GET",
      lang: lang,
    }
  );

  return response;
};