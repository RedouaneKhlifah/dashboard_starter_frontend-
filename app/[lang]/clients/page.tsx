// Imports
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import httpServer from "@/lib/httpServer";

// Components
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ClientTable } from "@/components/client/ClientTablet";

// Types
import { IClient } from "@/interfaces/IClient";

// Props Interface
interface Props {
  params: {
    lang: Locale;
  };
}

// Fetch Clients Function with Pagination
const fetchClients = async (
  lang: Locale,
  page: number = 1,
  pageSize: number = 10
) => {
  return await httpServer(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients?page=${page}&pageSize=${pageSize}`,
    {
      method: "GET",
      lang: lang,
    }
  );
};

// UsersPage Component
export default async function UsersPage({ params }: Props) {
  // Fetch translation and clients in parallel
  const [translation, res] = await Promise.all([
    getDictionary(params.lang),
    fetchClients(params.lang, 1, 10), // Fetch first page with 10 records
  ]);

  // Handle API errors
  if (!res.ok) {
    return <div>Error loading clients. Please try again later.</div>;
  }

  // Parse response
  const response = await res.json();
  const records: IClient[] = response.data;
  const totalRecords: number = response.total;

  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="p-6">
        <ClientTable
          records={records}
          totalRecords={totalRecords}
          translation={translation}
          lang={params.lang}
        />
      </div>
    </DashboardLayout>
  );
}
