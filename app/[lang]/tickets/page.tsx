// Imports
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import httpServer from "@/lib/httpServer";

// Components
import DashboardLayout from "@/components/layout/dashboard-layout";
import { TableTicket } from "@/components/ticket/TableTicket";

// Types
import { ITicket } from "@/interfaces/ITicket";

// Props Interface
interface Props {
  params: {
    lang: Locale;
  };
}

// Fetch Clients Function
const fetchTickets = async (lang: Locale) => {
  return await httpServer(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/tickets`,
    {
      method: "GET",
      lang: lang,
    }
  );
};

// UsersPage Component
export default async function TicketPage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  let records: ITicket[] = [];
  let totalRecords: number = 0;

  const res = await fetchTickets(params.lang);
  if (res.ok) {
    const response = await res.json();
    records = response.data;
    totalRecords = response.total as number;
  }

  
  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="p-6">
        <TableTicket
          records={records}
          totalRecords={totalRecords}
          translation={translation}
          lang={params.lang}
        />
      </div>
    </DashboardLayout>
  );
}
