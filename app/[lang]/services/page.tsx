// Imports
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import httpServer from "@/lib/httpServer";

// Components
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ServiceTable } from "@/components/service/ServiceTable";

// Types
import { IService } from "@/interfaces/IService";

// Props Interface
interface Props {
  params: {
    lang: Locale;
  };
}

// Fetch function
const fetchServices = async (lang: Locale) => {
  return await httpServer(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/services`,
    {
      method: "GET",
      lang: lang,
    }
  );
};

// Page Component
export default async function ServicePage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  let records: IService[] = [];
  let totalRecords: number = 0;

  const res = await fetchServices(params.lang);
  if (res.ok) {
    const response = await res.json();
    records = response.data;
    totalRecords = response.total as number;
  }

  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="p-6">
        <ServiceTable
          records={records}
          totalRecords={totalRecords}
          translation={translation}
          lang={params.lang}
        />
      </div>
    </DashboardLayout>
  );
}
