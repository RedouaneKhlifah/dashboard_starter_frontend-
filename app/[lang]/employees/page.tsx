// Imports
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import httpServer from "@/lib/httpServer";

// Components
import DashboardLayout from "@/components/layout/dashboard-layout";
import { EmployeesTable } from "@/components/employee/EmployeeTablet";

// Types
import { IEmployee } from "@/interfaces/IEmployee";

// Props Interface
interface Props {
  params: {
    lang: Locale;
  };
}

// Fetch Employeess Function
const fetchEmployeess = async (lang: Locale) => {
  return await httpServer(
    `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/employees`,
    {
      method: "GET",
      lang: lang,
    }
  );
};

// UsersPage Component
export default async function UsersPage({ params }: Props) {
  const translation = await getDictionary(params.lang);
  let records: IEmployee[] = [];
  let totalRecords: number = 0;

  const res = await fetchEmployeess(params.lang);
  if (res.ok) {
    const response = await res.json();
    records = response.data;
    totalRecords = response.total as number;
  }

  return (
    <DashboardLayout lang={params.lang} translation={translation}>
      <div className="p-6">
        <EmployeesTable
          records={records}
          totalRecords={totalRecords}
          translation={translation}
          lang={params.lang}
        />
      </div>
    </DashboardLayout>
  );
}
